
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Artisan Application Form
      </h2>
      <p className="mb-6 text-center text-gray-600">
        Please provide your details to get approved.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* LOCATION */}
        <input
          type="text"
          name="location"
          placeholder="Your Location (City, State)"
          value={location}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        <button
          type="button"
          onClick={detectLocation}
          className="w-full py-2 bg-green-600 text-white rounded-md"
        >
          Detect My Location
        </button>

        {/* AADHAAR NUMBER */}
        <div>
          <label className="font-semibold">Aadhaar Number</label>
          <input
            type="text"
            name="aadhaarNumber"
            placeholder="Enter Aadhaar number"
            maxLength="12"
            value={aadhaarNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                aadhaarNumber: e.target.value.replace(/\D/g, "").slice(0, 12),
              })
            }
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* MOBILE NUMBER */}
        <div>
          <label className="font-medium">📱 Mobile Number Verification</label>
          <div className="flex">
            <span className="px-3 py-2 border border-r-0 bg-gray-50">
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
              className="flex-1 px-4 py-2 border rounded-r-md"
            />
          </div>

          {!otpSent && (
            <button
              type="button"
              onClick={sendOTP}
              disabled={mobileNumber.length !== 10 || otpVerified}
              className={`w-full text-white py-2 rounded-md ${
                mobileNumber.length !== 10
                  ? "bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {otpVerified ? "Verified" : "Send OTP"}
            </button>
          )}
        </div>

        {/* OTP INPUT */}
        {otpSent && !otpVerified && (
          <div className="bg-blue-50 p-4 rounded-md space-y-3">
            <p className="text-blue-800">
              OTP sent to +91-{mobileNumber}
            </p>

            <input
              type="text"
              placeholder="000000"
              maxLength="6"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full px-4 py-2 border rounded-md text-center tracking-widest"
            />

            <div className="flex justify-between text-sm">
              <span>{attemptsLeft} attempts left</span>

              {otpTimer > 0 ? (
                <span className="text-orange-600">
                  Resend in {otpTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resendOTP}
                  className="text-blue-600 underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={verifyOTP}
              disabled={otp.length !== 6}
              className={`w-full text-white py-2 rounded-md ${
                otp.length !== 6
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Verify OTP
            </button>
          </div>
        )}

        {/* VERIFIED UI */}
        {otpVerified && (
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-green-700 font-medium">
              ✅ Mobile Verified: +91-{mobileNumber}
            </p>
          </div>
        )}

        {/* SERVICE CATEGORY */}
        <select
          name="serviceCategory"
          value={serviceCategory}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="" disabled>
            -- Select Your Service --
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={!otpVerified}
          className={`w-full py-3 text-white rounded-md ${
            otpVerified
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit Application
        </button>

        {!otpVerified && (
          <p className="text-center text-sm text-gray-500">
            Verify mobile number to submit application
          </p>
        )}
      </form>
    </div>
  );
};

export default ArtisanApplication;
