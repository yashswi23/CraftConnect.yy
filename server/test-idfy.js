import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Test Idfy API directly
const testIdfyAPI = async () => {
  try {
    console.log("=== Testing Idfy API Directly ===");
    console.log("API Key:", process.env.IDFY_API_KEY ? "Present" : "Missing");
    console.log("Account ID:", process.env.IDFY_ACCOUNT_ID ? "Present" : "Missing");

    // Test with a simple API call (without file upload)
    const response = await axios.get(`https://api.idfy.com/v3/tasks?account_id=${process.env.IDFY_ACCOUNT_ID}`, {
      headers: {
        "api-key": process.env.IDFY_API_KEY,
        "Content-Type": "application/json"
      }
    });

    console.log("API Status:", response.status);
    console.log("API Response:", response.data);

  } catch (error) {
    console.error("=== Idfy API Error ===");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Headers:", error.response?.headers);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
  }
};

testIdfyAPI();