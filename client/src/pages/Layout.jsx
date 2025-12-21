// import React from "react";
// import { Link, Outlet } from "react-router-dom";

// const Layout = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Navbar */}
//       <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">
//         <h1 className="text-xl font-bold">CraftConnect</h1>
//         <div className="space-x-4">
//           <Link to="/register" className="hover:underline">Register</Link>
//           <Link to="/login" className="hover:underline">Login</Link>
//           <Link to="/dashboard" className="hover:underline">Dashboard</Link>
//         </div>
//       </nav>

//       {/* Page Content */}
//       <main className="flex-1 p-6">
//         <Outlet />
//       </main>

//       {/* Footer */}
//       <footer className="p-4 bg-gray-800 text-gray-300 text-center">
//         © {new Date().getFullYear()} CraftConnect
//       </footer>
//     </div>
//   );
// };

// export default Layout;

import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Layout = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("craftconnect_token");
    localStorage.removeItem("isAdmin");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2 cursor-pointer">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              ✨ CraftConnect
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {!user && (
              <>
                <Link
                  to="/register"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Dashboard
                </Link>

                {user.isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    className="text-gray-300 hover:text-white transition-colors font-medium"
                  >
                    Admin Panel
                  </Link>
                )}

                <div className="text-gray-400 text-sm">
                  Welcome, <span className="text-cyan-400 font-semibold">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-red-500/50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          © {new Date().getFullYear()} CraftConnect. Connecting artisans and customers worldwide. 🚀
        </div>
      </footer>
    </div>
  );
};

export default Layout;

