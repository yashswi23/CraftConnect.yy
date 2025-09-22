// // import React from 'react';

// // const OrderCard = ({ order }) => {
// //     const getStatusColor = (status) => {
// //         switch (status) {
// //             case 'Pending Confirmation':
// //             case 'Confirmed': return 'bg-yellow-400 text-yellow-800';
// //             case 'On The Way':
// //             case 'Arrived':
// //             case 'Work In Progress': return 'bg-blue-400 text-blue-800';
// //             case 'Work Complete':
// //             case 'Payment Done': return 'bg-green-400 text-green-800';
// //             case 'Cancelled': return 'bg-red-400 text-red-800';
// //             default: return 'bg-gray-400 text-gray-800';
// //         }
// //     };

// //     return (
// //         <div className={`border-l-4 ${getStatusColor(order.status)} rounded-lg p-4 mb-4 bg-white shadow`}>
// //             <h4 className="text-lg font-semibold mb-2">Booking with: {order.artisan.name}</h4>
// //             <p className="text-gray-700"><strong>Service:</strong> {order.artisan.artisanInfo.serviceCategory}</p>
// //             <p className="text-gray-700"><strong>Booked On:</strong> {new Date(order.bookingDate).toLocaleDateString()}</p>
// //             <p className="text-gray-700">
// //                 <strong>Live Status: </strong>
// //                 <span className="font-bold">{order.status}</span>
// //             </p>
// //         </div>
// //     );
// // };

// // export default OrderCard;
// import React, { useState } from "react";
// import ReactStars from "react-rating-stars-component";
// import axios from "axios";

// const OrderCard = ({ order, refreshOrders }) => {
//   const [rating, setRating] = useState(order.userRating || 0);
//   const [submitting, setSubmitting] = useState(false);

//   const handleRatingChange = async (newRating) => {
//     setRating(newRating);
//     setSubmitting(true);
//     try {
//       const token = localStorage.getItem("craftconnect_token");
//       await axios.post(
//         `http://localhost:5000/api/users/rate/${order.artisan._id}`,
//         { rating: newRating },
//         { headers: { "x-auth-token": token } }
//       );
//       // Optionally refresh orders or artisan list to show updated rating
//       if (refreshOrders) refreshOrders();
//     } catch (err) {
//       console.error("Error submitting rating", err);
//       alert("Could not submit rating. Try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending Confirmation":
//       case "Confirmed":
//         return "bg-yellow-400 text-yellow-800";
//       case "On The Way":
//       case "Arrived":
//       case "Work In Progress":
//         return "bg-blue-400 text-blue-800";
//       case "Work Complete":
//       case "Payment Done":
//         return "bg-green-400 text-green-800";
//       case "Cancelled":
//         return "bg-red-400 text-red-800";
//       default:
//         return "bg-gray-400 text-gray-800";
//     }
//   };

//   return (
//     <div className={`border-l-4 ${getStatusColor(order.status)} rounded-lg p-4 mb-4 bg-white shadow`}>
//       <h4 className="text-lg font-semibold mb-2">Booking with: {order.artisan.name}</h4>
//       <p className="text-gray-700"><strong>Service:</strong> {order.artisan.artisanInfo.serviceCategory}</p>
//       <p className="text-gray-700"><strong>Booked On:</strong> {new Date(order.bookingDate).toLocaleDateString()}</p>
//       <p className="text-gray-700"><strong>Live Status:</strong> {order.status}</p>

//       {/* Show rating stars only if work is complete */}
//       {order.status === "Work Complete" && (
//         <div className="mt-2">
//           <ReactStars
//             count={5}
//             size={24}
//             value={rating}
//             isHalf={true}
//             edit={!submitting}
//             onChange={handleRatingChange}
//             activeColor="#ffd700"
//           />
//           {submitting && <p className="text-sm text-gray-500 mt-1">Submitting...</p>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderCard;
import React, { useState } from 'react';
import ReactStars from 'react-rating-stars-component';
import axios from 'axios';

const OrderCard = ({ order, token, onRatingUpdate }) => {
  const [rating, setRating] = useState(order.artisan.artisanInfo.rating || 0);
  const [isRated, setIsRated] = useState(false);

  const handleRatingChange = async (newRating) => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.post(
        `http://localhost:5000/api/users/rate/${order.artisan._id}`,
        { rating: newRating },
        config
      );
      setRating(res.data.rating);
      setIsRated(true);
      if (onRatingUpdate) onRatingUpdate(order.artisan._id, res.data.rating);
      alert('Rating submitted!');
    } catch (err) {
      console.error(err);
      alert('Error submitting rating');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Confirmation':
      case 'Confirmed': return 'bg-yellow-400 text-yellow-800';
      case 'On The Way':
      case 'Arrived':
      case 'Work In Progress': return 'bg-blue-400 text-blue-800';
      case 'Work Complete':
      case 'Payment Done': return 'bg-green-400 text-green-800';
      case 'Cancelled': return 'bg-red-400 text-red-800';
      default: return 'bg-gray-400 text-gray-800';
    }
  };

  return (
    <div className={`border-l-4 ${getStatusColor(order.status)} rounded-lg p-4 mb-4 bg-white shadow`}>
      <h4 className="text-lg font-semibold mb-2">Booking with: {order.artisan.name}</h4>
      <p className="text-gray-700"><strong>Service:</strong> {order.artisan.artisanInfo.serviceCategory}</p>
      <p className="text-gray-700"><strong>Booked On:</strong> {new Date(order.bookingDate).toLocaleDateString()}</p>
      <p className="text-gray-700">
        <strong>Live Status: </strong>
        <span className="font-bold">{order.status}</span>
      </p>

      {/* Show rating option only if work is complete */}
      {order.status === 'Work Complete' && !isRated && (
        <div className="mt-2">
          <span className="text-gray-700 mr-2">Rate this artisan:</span>
          <ReactStars
            count={5}
            size={24}
            isHalf={true}
            activeColor="#ffd700"
            value={rating}
            onChange={handleRatingChange}
          />
        </div>
      )}

      {/* Show current rating if already rated */}
      {rating > 0 && (
        <div className="mt-2 text-gray-700">
          Current Rating: {rating.toFixed(1)} ⭐
        </div>
      )}
    </div>
  );
};

export default OrderCard;

