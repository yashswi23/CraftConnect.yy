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
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="card card-hover p-8 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your CraftConnect account</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="form-input focus-ring"
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={password}
              onChange={onChange}
              minLength="6"
              required
              className="form-input focus-ring"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full text-lg py-3 focus-ring"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
              Sign up here
            </a>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default Login;

