import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArtisanCard from './ArtisanCard.jsx';
import OrderCard from './OrderCard.jsx';

const CustomerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingArtisans, setLoadingArtisans] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const token = localStorage.getItem('craftconnect_token');
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/users/artisans', config);
        setArtisans(res.data);
      } catch (error) {
        console.error("Could not fetch artisans", error);
      } finally {
        setLoadingArtisans(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('craftconnect_token');
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/bookings/my-orders', config);
        setOrders(res.data);
      } catch (error) {
        console.error("Could not fetch orders", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchArtisans();
    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('craftconnect_token');
    alert('You have been logged out.');
    navigate('/login');
  };

  const groupedArtisans = artisans.reduce((acc, artisan) => {
    const category = artisan.artisanInfo.serviceCategory;
    if (!acc[category]) acc[category] = [];
    acc[category].push(artisan);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* My Bookings */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">My Bookings</h3>
        {loadingOrders ? (
          <p className="text-gray-500">Loading your bookings...</p>
        ) : orders.length > 0 ? (
          <div className="grid gap-4">
            {orders.map(order => <OrderCard key={order._id} order={order} />)}
          </div>
        ) : (
          <p className="text-gray-500">You have not made any bookings yet.</p>
        )}
      </section>

      {/* Browse Artisans */}
      <section>
        <h3 className="text-xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">Browse & Book Artisans</h3>
        {loadingArtisans ? (
          <p className="text-gray-500">Loading artisans...</p>
        ) : (
          Object.keys(groupedArtisans).length > 0 ? (
            Object.keys(groupedArtisans).map(category => (
              <div key={category} className="mb-8">
                <h4 className="text-lg font-medium text-blue-600 mb-3">{category}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedArtisans[category].map(artisan => (
                    <ArtisanCard key={artisan._id} artisan={artisan} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No artisans found at the moment.</p>
          )
        )}
      </section>
    </div>
  );
};

export default CustomerDashboard;
