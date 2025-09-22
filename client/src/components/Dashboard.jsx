import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Dono dashboards ko import karein
import ArtisanDashboard from './ArtisanDashboard.jsx';
import CustomerDashboard from './CustomerDashboard.jsx';

// Yeh component ab ek "Manager" hai jo decide karta hai kaunsa dashboard dikhana hai
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Yeh function component load hote hi chalta hai
    const fetchUserData = async () => {
      try {
        // 1. Local storage se token lo
        const token = localStorage.getItem('craftconnect_token');
        if (!token) {
          // Agar token nahi hai, toh login page par bhej do
          navigate('/login');
          return;
        }

        // 2. Request ke header mein token set karo
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        // 3. Backend se user ka data fetch karo
        const res = await axios.get('http://localhost:5000/api/users/me', config);
        setUser(res.data); // User state ko update karo

      } catch (error) {
        console.error('Could not fetch user data', error);
        // Agar token galat hai, toh token remove karke login page par bhej do
        localStorage.removeItem('craftconnect_token');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]); // useEffect ko navigate change hone par dobara chalao

  // Jab tak user ka data load ho raha hai, yeh dikhao
  if (!user) {
    return <div>Loading Dashboard...</div>;
  }

  // Yahan hai asli logic: User ka role check karo
  if (user.role === 'artisan') {
    // Agar role artisan hai, toh ArtisanDashboard dikhao
    return <ArtisanDashboard user={user} />;
  } else {
    // Nahi toh, CustomerDashboard dikhao
    return <CustomerDashboard user={user} />;
  }
};
export default Dashboard;

