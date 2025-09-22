import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BookingCard from './BookingCard.jsx';

const ArtisanDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const fetchMyJobs = async () => {
    try {
      setLoadingJobs(true);
      const token = localStorage.getItem('craftconnect_token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('http://localhost:5000/api/bookings/my-jobs', config);
      setBookings(res.data);
    } catch (error) {
      console.error("Could not fetch jobs", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('craftconnect_token');
    alert('You have been logged out.');
    navigate('/login');
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('craftconnect_token');
      const config = { headers: { 'x-auth-token': token } };
      const body = { status: newStatus };
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, body, config);
      alert(`Status updated to: ${newStatus}`);
      fetchMyJobs();
    } catch (error) {
      alert("Could not update status. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* User Info */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Artisan Dashboard</h2>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Welcome, {user.name}!</h3>
        <p className="text-gray-600 mb-2"><strong>Email:</strong> {user.email}</p>
        <h4 className="text-md font-medium text-gray-700 mb-1">My Artisan Information</h4>
        <p className="text-gray-600"><strong>Service:</strong> {user.artisanInfo.serviceCategory}</p>
        <p className="text-gray-600">
          <strong>Status:</strong>{" "}
          <span className="font-bold text-green-600">{user.artisanInfo.status.toUpperCase()}</span>
        </p>
      </div>

      {/* My Bookings */}
      <section>
        <h2 className="text-xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 text-center">My Bookings</h2>
        {loadingJobs ? (
          <p className="text-gray-500 text-center">Loading your jobs...</p>
        ) : bookings.length > 0 ? (
          <div className="grid gap-4">
            {bookings.map(booking => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">You have no bookings yet.</p>
        )}
      </section>

      {/* Logout Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ArtisanDashboard;
