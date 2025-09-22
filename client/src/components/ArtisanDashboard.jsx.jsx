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
    <div style={{ textAlign: 'left', width: '100%', maxWidth: '800px', margin: 'auto' }}>
      {/* User ki personal info wala section */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9', color: '#333', marginBottom: '30px' }}>
          <h2 style={{ textAlign: 'center' }}>Artisan Dashboard</h2>
          <h3>Welcome, {user.name}!</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <h4>My Artisan Information</h4>
          <p><strong>Service:</strong> {user.artisanInfo.serviceCategory}</p>
          <p><strong>Status:</strong> <span style={{fontWeight: 'bold', color: 'green'}}>{user.artisanInfo.status.toUpperCase()}</span></p>
      </div>
      
      {/* Naya "My Active Jobs" section */}
      <div>
        <h2 style={{ textAlign: 'center', borderTop: '2px solid #eee', paddingTop: '20px' }}>My Bookings</h2>
        {loadingJobs ? (
            <p>Loading your jobs...</p>
        ) : bookings.length > 0 ? (
            bookings
                .map(booking => (
                    <BookingCard 
                        key={booking._id} 
                        booking={booking} 
                        onStatusUpdate={handleStatusUpdate} 
                    />
                ))
        ) : (
            <p style={{ textAlign: 'center' }}>You have no bookings yet.</p>
        )}
      </div>

      <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}>Logout</button>
    </div>
  );
};

export default ArtisanDashboard;