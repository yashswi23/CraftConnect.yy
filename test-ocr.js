// Simple test to check OCR endpoint
const testOCREndpoint = async () => {
  try {
    // Test 1: Check API health
    console.log("=== Testing API Health ===");
    const healthResponse = await fetch("http://localhost:5000/api/aadhaar/test");
    const healthData = await healthResponse.json();
    console.log("Health Check:", healthData);

    // Test 2: Try OCR with no file (should fail gracefully)
    console.log("\n=== Testing OCR without file ===");
    const formData = new FormData();
    
    const ocrResponse = await fetch("http://localhost:5000/api/aadhaar/ocr-upload", {
      method: "POST",
      body: formData
    });
    
    const ocrData = await ocrResponse.json();
    console.log("OCR Response (no file):", ocrData);
    console.log("Status:", ocrResponse.status);

  } catch (error) {
    console.error("Test Error:", error);
  }
};

// Run the test
testOCREndpoint();