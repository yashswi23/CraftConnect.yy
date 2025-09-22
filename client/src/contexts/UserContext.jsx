import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('craftconnect_token');

  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const config = { headers: { 'x-auth-token': token } };
          const res = await axios.get('http://localhost:5000/api/users/me', config);
          setUser(res.data);
          localStorage.setItem('isAdmin', res.data.isAdmin ? 'true' : 'false');
        } catch {
          setUser(null);
          localStorage.removeItem('isAdmin');
        }
      };
      fetchUser();
    }
  }, [token]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
