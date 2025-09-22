// client/src/components/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('craftconnect_token');

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
        const config = { headers: { 'x-auth-token': token } };
        
        // Fetch logged in user info
        const userRes = await axios.get('http://localhost:5000/api/users/me', config);
        setUser(userRes.data);

        // Fetch bookings made by this user
        const bookingRes = await axios.get('http://localhost:5000/api/bookings/my-orders', config);
        setBookings(bookingRes.data);
      } catch (err) {
        alert('Failed to load user data or bookings.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUserAndBookings();
  }, [token]);

  if (loading) return <div>Loading your dashboard...</div>;

  if (!user) return <div>User not found or not logged in.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>

      <h3>Your Bookings</h3>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              Service: {booking.serviceCategory || 'N/A'} with {booking.artisan.name} - Status: {booking.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDashboard;
