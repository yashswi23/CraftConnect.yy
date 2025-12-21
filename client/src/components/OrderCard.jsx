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

const OrderCard = ({
  order,
  token,
  onRatingUpdate,
  payments = [],
  wallet,
  refreshPayments,
  refreshWallet,
  refreshOrders
}) => {
  const [rating, setRating] = useState(order.artisan.artisanInfo.rating || 0);
  const [isRated, setIsRated] = useState(false);
  const [amount, setAmount] = useState(500);
  const [useWallet, setUseWallet] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);

  const payment = payments.find((p) => (p.booking?._id || p.booking) === order._id);

  const refreshData = async () => {
    if (refreshPayments) await refreshPayments();
    if (refreshWallet) await refreshWallet();
    if (refreshOrders) await refreshOrders();
  };

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

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const startPayment = async (payFromWallet) => {
    if (!amount || Number(amount) <= 0) {
      alert('Enter a valid amount.');
      return;
    }
    setIsPaying(true);
    try {
      const config = { headers: { 'x-auth-token': token } };
      const body = {
        bookingId: order._id,
        amount: Number(amount),
        currency: 'INR',
        useWallet: payFromWallet,
        purpose: 'booking',
        description: `Booking with ${order.artisan.name}`
      };

      const res = await axios.post('http://localhost:5000/api/payments/order', body, config);

      if (payFromWallet) {
        alert('Paid from wallet. Funds are held in escrow until release.');
        await refreshData();
        return;
      }

      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        alert('Unable to load Razorpay checkout.');
        return;
      }

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        order_id: res.data.orderId,
        name: 'CraftConnect',
        description: `Booking with ${order.artisan.name}`,
        handler: async (response) => {
          try {
            await axios.post(
              'http://localhost:5000/api/payments/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              config
            );
            alert('Payment verified and held in escrow.');
            await refreshData();
          } catch (err) {
            console.error(err);
            alert('Payment verified but could not update server.');
          }
        },
        prefill: {
          name: order.customer?.name || 'Customer',
          email: order.customer?.email || '',
          contact: ''
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Could not start payment.');
    } finally {
      setIsPaying(false);
    }
  };

  const releasePayment = async () => {
    if (!payment) return;
    setIsReleasing(true);
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.post(`http://localhost:5000/api/payments/release/${payment._id}`, {}, config);
      alert('Payment released to artisan.');
      await refreshData();
    } catch (err) {
      console.error(err);
      alert('Could not release payment.');
    } finally {
      setIsReleasing(false);
    }
  };

  const downloadInvoice = async () => {
    if (!payment) return;
    try {
      const config = { headers: { 'x-auth-token': token }, responseType: 'blob' };
      const res = await axios.get(`http://localhost:5000/api/payments/invoice/${payment._id}`, config);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error(err);
      alert('Could not load invoice.');
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

  const paymentStatusLabel = payment
    ? `${payment.status} ${payment.escrow ? '(escrow)' : ''}`
    : 'Not paid';

  const canRelease = payment && payment.status === 'escrow' && order.status === 'Work Complete';
  const walletBalance = wallet?.balance || 0;

  return (
    <div className={`border-l-4 ${getStatusColor(order.status)} rounded-lg p-4 mb-4 bg-white shadow`}>
      <h4 className="text-lg font-semibold mb-2">Booking with: {order.artisan.name}</h4>
      <p className="text-gray-700"><strong>Service:</strong> {order.artisan.artisanInfo.serviceCategory}</p>
      <p className="text-gray-700"><strong>Booked On:</strong> {new Date(order.bookingDate).toLocaleDateString()}</p>
      <p className="text-gray-700">
        <strong>Live Status: </strong>
        <span className="font-bold">{order.status}</span>
      </p>

      <div className="mt-3 text-sm text-gray-700">
        <div><strong>Payment:</strong> {paymentStatusLabel}</div>
        {payment && <div>Amount: ₹{payment.amount} {payment.currency}</div>}
        {wallet && <div>Wallet balance: ₹{walletBalance.toFixed(2)}</div>}
      </div>

      {!payment && order.status === 'Work Complete' && (
        <div className="mt-3 space-y-2">
          <label className="block text-sm text-gray-700 font-medium">Amount (₹)</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <input
              id={`wallet-${order._id}`}
              type="checkbox"
              checked={useWallet}
              onChange={(e) => setUseWallet(e.target.checked)}
            />
            <label htmlFor={`wallet-${order._id}`}>
              Pay from wallet (balance ₹{walletBalance.toFixed(2)})
            </label>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              disabled={isPaying || (useWallet && walletBalance < Number(amount))}
              onClick={() => startPayment(useWallet)}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
            >
              {useWallet ? 'Pay from Wallet' : 'Pay with Razorpay'}
            </button>
          </div>
          <p className="text-xs text-gray-500">Money is held in escrow until released.</p>
        </div>
      )}

      {!payment && order.status !== 'Work Complete' && order.status !== 'Cancelled' && (
        <p className="text-sm text-gray-600 mt-3 italic">💳 Payment options will appear after artisan marks work complete.</p>
      )}

      {payment && (
        <div className="mt-3 space-y-2">
          {canRelease && (
            <button
              disabled={isReleasing}
              onClick={releasePayment}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-300"
            >
              {isReleasing ? 'Releasing...' : 'Release to Artisan'}
            </button>
          )}
          <button
            onClick={downloadInvoice}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
          >
            View Invoice
          </button>
        </div>
      )}

      {order.status === 'Work Complete' && !isRated && (
        <div className="mt-3">
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

      {rating > 0 && (
        <div className="mt-2 text-gray-700">
          Current Rating: {rating.toFixed(1)} ⭐
        </div>
      )}
    </div>
  );
};

export default OrderCard;

