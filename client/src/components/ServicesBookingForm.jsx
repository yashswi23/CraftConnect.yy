// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const ServiceBookingForm = () => {
//     const [artisans, setArtisans] = useState([]);
//     const [selectedArtisan, setSelectedArtisan] = useState('');
//     const [bookingDate, setBookingDate] = useState('');
//     const [loading, setLoading] = useState(true);

//     const navigate = useNavigate();
//     const token = localStorage.getItem('craftconnect_token');

//     useEffect(() => {
//         const fetchArtisans = async () => {
//             try {
//                 const config = { headers: { 'x-auth-token': token } };
//                 const res = await axios.get('http://localhost:5000/api/users/artisans', config);
//                 setArtisans(res.data);
//             } catch {
//                 alert('Failed to load artisans.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchArtisans();
//     }, [token]);

//     const onSubmit = async (e) => {
//         e.preventDefault();
//         if (!selectedArtisan) return alert('Please select an artisan.');
//         if (!bookingDate) return alert('Please select a booking date.');

//         try {
//             const config = { headers: { 'x-auth-token': token } };
//             await axios.post('http://localhost:5000/api/bookings', {
//                 artisanId: selectedArtisan,
//                 bookingDate,
//             }, config);
//             alert('Booking successful!');
//             navigate('/dashboard');
//         } catch {
//             alert('Booking failed.');
//         }
//     };

//     if (loading) return <div className="text-center mt-10">Loading services...</div>;

//     return (
//         <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
//             <h2 className="text-2xl font-bold mb-4 text-center">Book a Service</h2>
//             <form onSubmit={onSubmit} className="space-y-4">
//                 <div>
//                     <label className="block mb-1">Choose an artisan:</label>
//                     <select
//                         value={selectedArtisan}
//                         onChange={(e) => setSelectedArtisan(e.target.value)}
//                         required
//                         className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     >
//                         <option value="">-- Select an artisan --</option>
//                         {artisans.map(a => (
//                             <option key={a._id} value={a._id}>
//                                 {a.name} - {a.artisanInfo.serviceCategory}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div>
//                     <label className="block mb-1">Booking Date:</label>
//                     <input
//                         type="date"
//                         value={bookingDate}
//                         onChange={(e) => setBookingDate(e.target.value)}
//                         required
//                         className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     />
//                 </div>
//                 <button
//                     type="submit"
//                     className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                     Book Now
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default ServiceBookingForm;


import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const ServiceBookingForm = () => {
  const [artisans, setArtisans] = useState([]);
  const [selectedArtisan, setSelectedArtisan] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [loading, setLoading] = useState(true);

  const [userCoords, setUserCoords] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("craftconnect_token");
  const { updateLocation } = useContext(UserContext);

  // --------------------------
  // Detect User Location
  // --------------------------
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };

        setUserCoords(loc);
        updateLocation(loc);

        alert("Location updated!");
      },
      () => alert("Failed to detect location. Allow location access.")
    );
  };

  // --------------------------
  // Calculate distance
  // --------------------------
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // --------------------------
  // Fetch Artisans
  // --------------------------
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const config = { headers: { "x-auth-token": token } };
        const res = await axios.get(
          "http://localhost:5000/api/users/artisans",
          config
        );

        let data = res.data;

        // Sort by nearest if user location is available
        if (userCoords) {
          data = data
            .map((a) => ({
              ...a,
              distance: a.location
                ? getDistance(
                    userCoords.lat,
                    userCoords.lon,
                    a.location.lat,
                    a.location.lon
                  )
                : null,
            }))
            .sort((x, y) => x.distance - y.distance);
        }

        setArtisans(data);
      } catch {
        alert("Failed to load artisans.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, [token, userCoords]);

  // --------------------------
  // Submit Booking
  // --------------------------
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedArtisan) return alert("Select an artisan.");
    if (!bookingDate) return alert("Select a booking date.");

    try {
      const config = { headers: { "x-auth-token": token } };

      await axios.post(
        "http://localhost:5000/api/bookings",
        {
          artisanId: selectedArtisan,
          bookingDate,
          userLocation: userCoords,
        },
        config
      );

      alert("Booking successful!");
      navigate("/dashboard");
    } catch {
      alert("Booking failed.");
    }
  };

  if (loading)
    return <div className="text-center mt-10">Loading services...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Book a Service</h2>

      {/* Detect My Location */}
      <button
        onClick={detectLocation}
        className="w-full mb-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
      >
        📍 Detect My Location
      </button>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Choose an artisan:</label>
          <select
            value={selectedArtisan}
            onChange={(e) => setSelectedArtisan(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Select an artisan --</option>

            {artisans.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name} - {a.artisanInfo.serviceCategory}
                {a.distance ? ` (${a.distance.toFixed(1)} km away)` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Booking Date:</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default ServiceBookingForm;
