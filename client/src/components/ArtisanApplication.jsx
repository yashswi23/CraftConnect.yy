
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const ArtisanApplication = () => {
//   const [formData, setFormData] = useState({
//     location: "",
//     serviceCategory: "",
//   });
//   // Mobile OTP Verification States
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(0);
//   const [attemptsLeft, setAttemptsLeft] = useState(3);

//   const navigate = useNavigate();
//   const { location, serviceCategory } = formData;
//   const categories = [
//     "Pottery",
//     "Painting",
//     "Handicrafts",
//     "Weaving",
//     "Jewellery Making",
//     "Other",
//   ];

//   const onChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   // 🌍 AUTO-DETECT LOCATION
//   const detectLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation not supported");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(async (pos) => {
//       const { latitude, longitude } = pos.coords;
//       try {
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//         );
//         const data = await res.json();
//         const city = data.address.city || data.address.town || data.address.village || "";
//         const state = data.address.state || "";
//         const country = data.address.country || "";
//         setFormData((prev) => ({
//           ...prev,
//           location: `${city}, ${state}, ${country}`,
//         }));
//       } catch (err) {
//         console.log(err);
//         alert("Could not detect location!");
//       }
//     });
//   };

//   // 📱 SEND OTP TO MOBILE
//   const sendOTP = async () => {
//     if (!mobileNumber || mobileNumber.length !== 10) {
//       return alert("Please enter a valid 10-digit mobile number");
//     }

//     setIsLoading(true);
//     try {
//       const res = await axios.post("http://localhost:5000/api/otp/send-otp", {
//         phoneNumber: mobileNumber,
//         purpose: "AADHAAR_VERIFICATION"
//       });

//       setOtpSent(true);
//       setOtpTimer(60); // 60 seconds timer
//       alert(`OTP sent to +91-${mobileNumber}!\n\n${res.data.devOTP ? `Dev OTP: ${res.data.devOTP}` : 'Check your SMS'}`);
      
//       // Start countdown timer
//       const timer = setInterval(() => {
//         setOtpTimer(prev => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
      
//     } catch (err) {
//       console.error("OTP Send Error:", err.response?.data || err.message);
//       const errorMsg = err.response?.data?.msg || "Failed to send OTP";
//       alert(`Error: ${errorMsg}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ✅ VERIFY OTP
//   const verifyOTP = async () => {
//     if (!otp || otp.length !== 6) {
//       return alert("Please enter a valid 6-digit OTP");
//     }

//     setIsLoading(true);
//     try {
//       const res = await axios.post("http://localhost:5000/api/otp/verify-otp", {
//         phoneNumber: mobileNumber,
//         otp: otp,
//         purpose: "AADHAAR_VERIFICATION"
//       });

//       setOtpVerified(true);
//       alert("🎉 Mobile number verified successfully!");
      
//     } catch (err) {
//       console.error("OTP Verify Error:", err.response?.data || err.message);
//       const errorMsg = err.response?.data?.msg || "Invalid OTP";
//       const attemptsRemaining = err.response?.data?.attemptsLeft;
      
//       if (attemptsRemaining !== undefined) {
//         setAttemptsLeft(attemptsRemaining);
//       }
      
//       alert(`${errorMsg}${attemptsRemaining !== undefined ? `\\nAttempts left: ${attemptsRemaining}` : ''}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 🔄 RESEND OTP
//   const resendOTP = async () => {
//     if (otpTimer > 0) {
//       return alert(`Please wait ${otpTimer} seconds before resending OTP`);
//     }

//     setIsLoading(true);
//     try {
//       await axios.post("http://localhost:5000/api/otp/resend-otp", {
//         phoneNumber: mobileNumber,
//         purpose: "AADHAAR_VERIFICATION"
//       });

//       setOtpTimer(60);
//       setAttemptsLeft(3);
//       alert("New OTP sent successfully!");
      
//       // Restart timer
//       const timer = setInterval(() => {
//         setOtpTimer(prev => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
      
//     } catch (err) {
//       console.error("Resend OTP Error:", err.response?.data || err.message);
//       alert("Failed to resend OTP. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 🔵 SUBMIT ARTISAN APPLICATION
//   const onSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!otpVerified) {
//       return alert("Please verify your mobile number first!");
//     }

//     try {
//       const token = localStorage.getItem("craftconnect_token");
//       const config = { headers: { "x-auth-token": token } };
      
//       const applicationData = {
//         ...formData,
//         verifiedMobile: mobileNumber,
//         verificationType: "MOBILE_OTP"
//       };
      
//       const res = await axios.put(
//         "http://localhost:5000/api/users/become-artisan",
//         applicationData,
//         config
//       );
      
//       alert(res.data.msg);
//       navigate("/dashboard");
//     } catch (err) {
//       alert("Error: " + (err.response?.data?.msg || "Application failed"));
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
//       <h2 className="text-2xl font-bold mb-4 text-center">Artisan Application Form</h2>
//       <p className="mb-6 text-center text-gray-600">
//         Please provide your details to get approved.
//       </p>

//       <form onSubmit={onSubmit} className="space-y-4">
//         {/* LOCATION */}
//         <input
//           type="text"
//           placeholder="Your Location (City, State)"
//           name="location"
//           value={location}
//           onChange={onChange}
//           required
//           className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           type="button"
//           onClick={detectLocation}
//           className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//         >
//           Detect My Location Automatically
//         </button>

//         {/* MOBILE NUMBER VERIFICATION */}
//         <div className="space-y-3">
//           <label className="block text-sm font-medium text-gray-700">
//             📱 Mobile Number Verification
//           </label>
          
//           <div className="flex">
//             <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
//               +91
//             </span>
//             <input
//               type="tel"
//               placeholder="Enter 10-digit mobile number"
//               value={mobileNumber}
//               onChange={(e) => {
//                 const value = e.target.value.replace(/\D/g, '').slice(0, 10);
//                 setMobileNumber(value);
//               }}
//               disabled={otpVerified}
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
//               maxLength="10"
//             />
//           </div>
          
//           {!otpSent ? (
//             <button
//               type="button"
//               onClick={sendOTP}
//               disabled={isLoading || mobileNumber.length !== 10 || otpVerified}
//               className={`w-full text-white py-2 rounded-md ${
//                 isLoading || mobileNumber.length !== 10 || otpVerified
//                   ? "bg-gray-400 cursor-not-allowed" 
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//             >
//               {isLoading ? "📤 Sending OTP..." : otpVerified ? "✅ Verified" : "Send OTP"}
//             </button>
//           ) : null}
//         </div>

//         {/* OTP VERIFICATION SECTION */}
//         {otpSent && !otpVerified && (
//           <div className="bg-blue-50 p-4 rounded-md space-y-3">
//             <div className="flex items-center space-x-2">
//               <span className="text-blue-600">📨</span>
//               <p className="text-sm text-blue-800">
//                 OTP sent to +91-{mobileNumber}
//               </p>
//             </div>
            
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Enter 6-digit OTP
//               </label>
//               <input
//                 type="text"
//                 placeholder="000000"
//                 value={otp}
//                 onChange={(e) => {
//                   const value = e.target.value.replace(/\D/g, '').slice(0, 6);
//                   setOtp(value);
//                 }}
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-lg tracking-widest"
//                 maxLength="6"
//               />
              
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-gray-600">
//                   {attemptsLeft > 0 ? `${attemptsLeft} attempts left` : 'No attempts left'}
//                 </span>
//                 {otpTimer > 0 ? (
//                   <span className="text-orange-600">Resend in {otpTimer}s</span>
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={resendOTP}
//                     className="text-blue-600 hover:underline"
//                     disabled={isLoading}
//                   >
//                     Resend OTP
//                   </button>
//                 )}
//               </div>
//             </div>
            
//             <button
//               type="button"
//               onClick={verifyOTP}
//               disabled={isLoading || otp.length !== 6}
//               className={`w-full text-white py-2 rounded-md ${
//                 isLoading || otp.length !== 6
//                   ? "bg-gray-400 cursor-not-allowed" 
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {isLoading ? "🔄 Verifying..." : "Verify OTP"}
//             </button>
//           </div>
//         )}

//         {/* VERIFICATION SUCCESS */}
//         {otpVerified && (
//           <div className="bg-green-50 p-4 rounded-md flex items-center space-x-3">
//             <span className="text-green-600 text-xl">✅</span>
//             <div>
//               <p className="text-green-800 font-medium">Mobile Verified!</p>
//               <p className="text-green-600 text-sm">+91-{mobileNumber}</p>
//             </div>
//           </div>
//         )}

//         {/* SERVICE CATEGORY */}
//         <select
//           name="serviceCategory"
//           value={serviceCategory}
//           onChange={onChange}
//           required
//           className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="" disabled>
//             -- Select Your Service --
//           </option>
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>

//         {/* SUBMIT */}
//         <button
//           type="submit"
//           disabled={!otpVerified}
//           className={`w-full py-3 text-white rounded-md transition-colors ${
//             otpVerified 
//               ? "bg-blue-600 hover:bg-blue-700" 
//               : "bg-gray-400 cursor-not-allowed"
//           }`}
//         >
//           {otpVerified ? "🚀 Submit Application" : "⚠️ Verify Mobile Number First"}
//         </button>
        
//         {!otpVerified && (
//           <p className="text-center text-sm text-gray-500 mt-2">
//             Please complete mobile verification to submit your application
//           </p>
//         )}
//       </form>
//     </div>
//   );
// };

// export default ArtisanApplication;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ArtisanApplication = () => {
  const [formData, setFormData] = useState({
    location: "",
    serviceCategory: "",
    aadhaarNumber: ""
  });

  // Mobile OTP verification states
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  const navigate = useNavigate();
  const { location, serviceCategory, aadhaarNumber } = formData;

  const categories = [
    "Pottery",
    "Painting",
    "Handicrafts",
    "Weaving",
    "Jewellery Making",
    "Other",
  ];

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🌍 Auto-detect location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();

        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "";
        const state = data.address.state || "";
        const country = data.address.country || "";

        setFormData((prev) => ({
          ...prev,
          location: `${city}, ${state}, ${country}`,
        }));
      } catch (err) {
        console.log(err);
        alert("Could not detect location!");
      }
    });
  };

  // 📱 Send OTP
  const sendOTP = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      return alert("Please enter a valid 10-digit mobile number");
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/otp/send-otp", {
        phoneNumber: mobileNumber,
        purpose: "AADHAAR_VERIFICATION",
      });

      setOtpSent(true);
      setOtpTimer(60);

      alert(
        `OTP sent to +91-${mobileNumber}!\n\n${
          res.data.devOTP ? `Dev OTP: ${res.data.devOTP}` : "Check your SMS"
        }`
      );

      // Timer countdown
      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("OTP Send Error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔍 Verify OTP
  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      return alert("Please enter a valid 6-digit OTP");
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/otp/verify-otp",
        {
          phoneNumber: mobileNumber,
          otp,
          purpose: "AADHAAR_VERIFICATION",
        }
      );

      setOtpVerified(true);
      alert("🎉 Mobile number verified successfully!");
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Invalid OTP";
      const attemptsRemaining = err.response?.data?.attemptsLeft;

      if (attemptsRemaining !== undefined)
        setAttemptsLeft(attemptsRemaining);

      alert(
        `${errorMsg}${
          attemptsRemaining !== undefined
            ? `\nAttempts left: ${attemptsRemaining}`
            : ""
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 🔁 Resend OTP
  const resendOTP = async () => {
    if (otpTimer > 0) {
      return alert(`Wait ${otpTimer} seconds to resend OTP`);
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/otp/resend-otp", {
        phoneNumber: mobileNumber,
        purpose: "AADHAAR_VERIFICATION",
      });

      setOtpTimer(60);
      setAttemptsLeft(3);
      alert("New OTP sent!");

      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      alert("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 Submit Application
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      return alert("Please verify your mobile number first!");
    }

    try {
      const token = localStorage.getItem("craftconnect_token");
      const config = { headers: { "x-auth-token": token } };

      const applicationData = {
        ...formData,
        verifiedMobile: mobileNumber,
        verificationType: "MOBILE_OTP",
        aadhaarVerified: true,
      };

      const res = await axios.put(
        "http://localhost:5000/api/users/become-artisan",
        applicationData,
        config
      );

      alert(res.data.msg);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Application failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
      </div>

      {/* Main Container */}
      <div className="relative max-w-2xl w-full mx-auto bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl p-8 transform transition-all hover:scale-[1.01] duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Artisan Application
          </h2>
          <p className="text-gray-600">Complete the verification process to become an artisan</p>
        </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* LOCATION */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            📍 Your Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              name="location"
              placeholder="Your Location (City, State)"
              value={location}
              onChange={onChange}
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
            />
          </div>
          <button
            type="button"
            onClick={detectLocation}
            className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-600 transform transition-all duration-200 hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Auto-Detect Location</span>
          </button>
        </div>

        {/* AADHAAR NUMBER */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            🆔 Aadhaar Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <input
              type="text"
              name="aadhaarNumber"
              placeholder="Enter 12-digit Aadhaar number"
              maxLength="12"
              value={aadhaarNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  aadhaarNumber: e.target.value.replace(/\D/g, "").slice(0, 12),
                })
              }
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
            />
          </div>
        </div>

        {/* MOBILE NUMBER */}
        <div className="space-y-3 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border-2 border-indigo-100">
          <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <span className="text-xl">📱</span>
            <span>Mobile Number Verification</span>
            <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">Required</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-4 py-3 border-2 border-r-0 border-gray-200 bg-gray-50 text-gray-600 font-medium text-sm rounded-l-xl">
              +91
            </span>
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={mobileNumber}
              onChange={(e) =>
                setMobileNumber(
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              disabled={otpVerified}
              maxLength="10"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-r-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none disabled:bg-gray-100"
            />
          </div>

          {!otpSent && (
            <button
              type="button"
              onClick={sendOTP}
              disabled={mobileNumber.length !== 10 || otpVerified || isLoading}
              className={`w-full text-white py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-200 flex items-center justify-center space-x-2 ${
                mobileNumber.length !== 10 || otpVerified || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-[1.02]"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending OTP...</span>
                </>
              ) : otpVerified ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Verified</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Send OTP</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* OTP INPUT */}
        {otpSent && !otpVerified && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-full animate-pulse">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-blue-900 font-semibold">OTP Sent Successfully!</p>
                <p className="text-blue-700 text-sm">+91-{mobileNumber}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                placeholder="● ● ● ● ● ●"
                maxLength="6"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl text-center text-2xl font-bold tracking-[0.5em] focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600 font-medium">
                  {attemptsLeft > 0 ? `${attemptsLeft} attempts remaining` : 'No attempts left'}
                </span>
              </div>

              {otpTimer > 0 ? (
                <span className="text-orange-600 font-semibold animate-pulse">
                  Resend in {otpTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={isLoading}
                  className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors duration-200"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={verifyOTP}
              disabled={otp.length !== 6 || isLoading}
              className={`w-full text-white py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-200 flex items-center justify-center space-x-2 ${
                otp.length !== 6 || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Verify OTP</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* VERIFIED UI */}
        {otpVerified && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-full animate-bounce">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-green-800 font-bold text-lg">Mobile Verified Successfully!</p>
                <p className="text-green-600 font-medium">+91-{mobileNumber}</p>
              </div>
            </div>
          </div>
        )}

        {/* SERVICE CATEGORY */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            🎨 Service Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <select
              name="serviceCategory"
              value={serviceCategory}
              onChange={onChange}
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none appearance-none bg-white"
            >
              <option value="" disabled>
                -- Select Your Service Category --
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!otpVerified}
            className={`w-full py-4 text-white rounded-xl font-bold text-lg shadow-lg transform transition-all duration-200 flex items-center justify-center space-x-3 ${
              otpVerified
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {otpVerified ? (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Submit Application</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Verify Mobile to Submit</span>
              </>
            )}
          </button>

          {!otpVerified && (
            <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl flex items-start space-x-3">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-yellow-800 font-semibold text-sm">Mobile Verification Required</p>
                <p className="text-yellow-700 text-xs mt-1">Please complete mobile number verification to submit your application</p>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
    </div>
  );
};

export default ArtisanApplication;
