// client/src/components/ArtisanDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BookingCard from './BookingCard.jsx'; // Naya component import karein

const ArtisanDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]); // Bookings ke liye nayi state
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Yeh function artisan ke saare jobs fetch karega
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

  // Component load hote hi jobs fetch karo
  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('craftconnect_token');
    alert('You have been logged out.');
    navigate('/login');
  };
  
  // Yeh function status update karne ke liye API call karega
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
        const token = localStorage.getItem('craftconnect_token');
        const config = { headers: { 'x-auth-token': token } };
        const body = { status: newStatus };
        
        await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, body, config);
        
        alert(`Status updated to: ${newStatus}`);
        fetchMyJobs(); // List ko turant refresh karo
    } catch (error) {
        alert("Could not update status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen gradient-bg section-padding">
      <div className="container-max">
        {/* Header Section */}
        <div className="card card-hover p-8 mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Artisan Dashboard</h1>
                <p className="text-gray-600">Manage your bookings and grow your business</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/portfolio-manager')}
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                📸 My Portfolio
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>

          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Welcome, {user.name}!</h3>
              </div>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Service Category</h3>
              </div>
              <p className="text-gray-600">{user.artisanInfo.serviceCategory}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Status</h3>
              </div>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                user.artisanInfo.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : user.artisanInfo.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.artisanInfo.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="card card-hover p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gradient">My Bookings</h2>
            <div className="text-sm text-gray-500">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            </div>
          </div>

          {loadingJobs ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner"></div>
              <span className="ml-3 text-gray-600">Loading your bookings...</span>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map(booking => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No bookings yet</h3>
              <p className="text-gray-600">Your bookings will appear here once customers start booking your services.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanDashboard;