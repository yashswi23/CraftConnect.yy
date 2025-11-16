// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const navigate = useNavigate();
//   const { email, password } = formData;

//   const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/users/login', formData);
//       localStorage.setItem('craftconnect_token', res.data.token);

//       const config = { headers: { 'x-auth-token': res.data.token } };
//       const userRes = await axios.get('http://localhost:5000/api/users/me', config);
//       localStorage.setItem('isAdmin', userRes.data.isAdmin ? 'true' : 'false');

//       alert('Successfully logged in!');

//       if (userRes.data.isAdmin) navigate('/admin-dashboard');
//       else navigate('/dashboard');
//     } catch (err) {
//       alert('Error: ' + (err.response?.data.msg || 'An error occurred'));
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
//         <form onSubmit={onSubmit} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email Address"
//             name="email"
//             value={email}
//             onChange={onChange}
//             required
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             name="password"
//             value={password}
//             onChange={onChange}
//             minLength="6"
//             required
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Login request
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      localStorage.setItem('craftconnect_token', res.data.token);

      // Fetch user
      const config = { headers: { 'x-auth-token': res.data.token } };
      const userRes = await axios.get('http://localhost:5000/api/users/me', config);

      // Store admin info
      localStorage.setItem('isAdmin', userRes.data.isAdmin ? 'true' : 'false');

      // Update context so Navbar updates instantly
      setUser(userRes.data);

      alert('Successfully logged in!');

      // Redirect
      if (userRes.data.isAdmin) navigate('/admin-dashboard');
      else navigate('/dashboard');
    } catch (err) {
      alert('Error: ' + (err.response?.data.msg || 'An error occurred'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

