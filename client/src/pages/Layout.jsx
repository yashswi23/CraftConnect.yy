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
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          CraftConnect
        </h1>

        <div className="space-x-4">
          {!user && (
            <>
              <Link to="/register" className="hover:underline">Register</Link>
              <Link to="/login" className="hover:underline">Login</Link>
            </>
          )}

          {user && (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>

              {user.isAdmin && (
                <Link to="/admin-dashboard" className="hover:underline">Admin Panel</Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="p-4 bg-gray-800 text-gray-300 text-center">
        © {new Date().getFullYear()} CraftConnect
      </footer>
    </div>
  );
};

export default Layout;

