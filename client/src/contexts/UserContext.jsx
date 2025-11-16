// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const UserContext = createContext();

// export const UserContextProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("craftconnect_token"));
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ---- LOAD USER ----
//   const loadUser = async () => {
//     if (!token){
//       setLoading(false);
//       return;
//     }
//     try {
//       const res = await axios.get("http://localhost:5000/api/users/me", {
//         headers: { "x-auth-token": token },
//       });
//       setUser(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//     setLoading(false);
//   };

//   // ---- UPDATE LOCATION (ADD HERE) ----
//   const updateLocation = async (loc) => {
//     try {
//       await axios.put(
//         "http://localhost:5000/api/users/update-location",
//         { location: loc }, // must send object
//         {
//           headers: {
//             "x-auth-token": token,
//           },
//         }
//       );

//       setUser((prev) => ({ ...prev, location: loc }));
//     } catch (err) {
//       console.log("Update Location Error:", err);
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     loadUser();
//   }, [token]);

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         token,
//         setToken,
//         setUser,
//         loadUser,
//         updateLocation, // <<---- must be inside value!!
//         loading,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("craftconnect_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { "x-auth-token": token },
      });

      setUser(res.data);
    } catch (err) {
      console.log("Load user error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 IMPORTANT — runs every time token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("craftconnect_token", token);
    }
    loadUser();
  }, [token]);  // <---- THIS FIXES YOUR REDIRECT PROBLEM

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        setToken,
        setUser,
        loadUser,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
