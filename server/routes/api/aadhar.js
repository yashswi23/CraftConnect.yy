import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import Tesseract from "tesseract.js";

const router = express.Router();

// Use memory storage for uploaded files
const upload = multer({ storage: multer.memoryStorage() });

// Backup OCR using Tesseract.js
const fallbackOCR = async (imageBuffer) => {
  try {
    console.log("=== TRYING FALLBACK OCR (Tesseract) ===");
    
    const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
    console.log("Tesseract OCR Text:", text);
    
    // Extract Aadhaar number using regex
    const aadhaarMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
    if (aadhaarMatch) {
      const aadhaarNumber = aadhaarMatch[0].replace(/\s/g, '');
      console.log("Extracted Aadhaar from Tesseract:", aadhaarNumber);
      return aadhaarNumber;
    }
    
    return null;
  } catch (err) {
    console.error("Tesseract OCR failed:", err.message);
    return null;
  }
};

// ========================
// 1️⃣ OCR UPLOAD
// ========================
router.post("/ocr-upload", upload.single("aadhaarImage"), async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Required: Add account_id for Idfy API
    if (!process.env.IDFY_ACCOUNT_ID) {
      throw new Error("IDFY_ACCOUNT_ID is required but not configured");
    }
    formData.append("account_id", process.env.IDFY_ACCOUNT_ID);

    console.log("=== OCR REQUEST DEBUG ===");
    console.log("API Key:", process.env.IDFY_API_KEY ? "Present" : "Missing");
    console.log("Account ID:", process.env.IDFY_ACCOUNT_ID ? "Present" : "Missing");
    console.log("File size:", req.file.size);
    console.log("File type:", req.file.mimetype);
    console.log("========================");

    const response = await axios.post(
      "https://api.idfy.com/v3/tasks/async/upload/kyc/aadhaar",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "api-key": process.env.IDFY_API_KEY,
        },
      }
    );

    console.log("=== OCR RESPONSE DEBUG ===");
    console.log("Status:", response.status);
    console.log("Response Data:", JSON.stringify(response.data, null, 2));
    console.log("==========================");

    const aadhaarNumber = response.data?.result?.data?.aadhaar_number;

    if (!aadhaarNumber) {
      console.log("Idfy OCR failed, trying fallback OCR...");
      
      // Try fallback OCR
      const fallbackNumber = await fallbackOCR(req.file.buffer);
      
      if (fallbackNumber) {
        return res.json({ aadhaarNumber: fallbackNumber, source: "tesseract" });
      }
      
      return res.status(400).json({ msg: "Could not extract Aadhaar number from image using any OCR method" });
    }

    res.json({ aadhaarNumber, source: "idfy" });
  } catch (err) {
    console.error("=== OCR ERROR DETAILS ===");
    console.error("Status:", err.response?.status);
    console.error("Headers:", err.response?.headers);
    console.error("Data:", err.response?.data);
    console.error("Message:", err.message);
    console.error("========================");
    
    // If Idfy API fails, automatically try Tesseract fallback
    if (err.response?.status === 401 || err.response?.data?.message?.includes("Account ID")) {
      console.log("Idfy API authentication failed, trying fallback OCR...");
      
      try {
        const fallbackNumber = await fallbackOCR(req.file.buffer);
        
        if (fallbackNumber) {
          return res.json({ aadhaarNumber: fallbackNumber, source: "tesseract" });
        }
      } catch (fallbackErr) {
        console.error("Fallback OCR also failed:", fallbackErr.message);
      }
    }
    
    const errorMsg = err.response?.data?.message || err.response?.data?.msg || err.message || "OCR Detection Failed";
    res.status(500).json({ 
      msg: "OCR Detection Failed - Idfy API Issue", 
      error: errorMsg,
      debug: {
        status: err.response?.status,
        data: err.response?.data,
        suggestion: "API credentials may be invalid. Using Tesseract as fallback."
      }
    });
  }
});

// ========================
// 2️⃣ SEND OTP
// ========================
router.post("/send-otp", async (req, res) => {
  const { aadhaar } = req.body;

  if (!aadhaar || aadhaar.length !== 12) {
    return res.status(400).json({ msg: "Invalid Aadhaar number" });
  }

  try {
    const response = await axios.post(
      "https://api.idfy.com/v3/tasks/async/verify_with_source/aadhaar_otp",
      {
        task_id: "aadhaar-otp",
        group_id: "aadhaar-otp",
        data: { aadhaar_number: aadhaar },
      },
      {
        headers: {
          "api-key": process.env.IDFY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const txnId = response.data.result.request_id;
    res.json({ txnId });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ msg: "OTP send failed" });
  }
});

// ========================
// 3️⃣ VERIFY OTP
// ========================
router.post("/verify-otp", async (req, res) => {
  const { txnId, otp } = req.body;

  if (!txnId || !otp) return res.status(400).json({ msg: "TxnId or OTP missing" });

  try {
    const response = await axios.post(
      "https://api.idfy.com/v3/tasks/async/verify_with_source/aadhaar_otp/verify",
      {
        task_id: "aadhaar-verify",
        group_id: "aadhaar-verify",
        data: { request_id: txnId, otp: otp },
      },
      {
        headers: {
          "api-key": process.env.IDFY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const status = response.data.result.data.status;

    if (status !== "success") {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    res.json({ success: true, data: response.data.result.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ msg: "OTP verification failed" });
  }
});

// ========================
// 4️⃣ TEST ROUTE - Check API Health
// ========================
router.get("/test", (req, res) => {
  res.json({ 
    msg: "Aadhaar API is working",
    hasApiKey: !!process.env.IDFY_API_KEY,
    hasAccountId: !!process.env.IDFY_ACCOUNT_ID,
    timestamp: new Date().toISOString()
  });
});

export default router;
