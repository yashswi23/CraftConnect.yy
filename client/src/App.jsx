import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Pages & Components
import Layout from "./pages/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ArtisanApplication from "./components/ArtisanApplication.jsx";
import ArtisanProfile from "./components/ArtisanProfile.jsx";
import ArtisanPortfolioManager from "./components/ArtisanPortfolioManager.jsx";
import AdminDashboard from "./components/AdminDashBoard.jsx";
import { UserContext } from "./contexts/UserContext.jsx";
import ServiceBookingForm from "./components/ServicesBookingForm.jsx";

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("craftconnect_token");
  const { user,loading } = useContext(UserContext);

  if (!token) return <Navigate to="/login" />;
  if(loading) return <p> Loading User...</p>
  if(!user) return <Navigate to="/login"/>
  if (adminOnly && user.isAdmin !== true){
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* Wrap sabhi routes ek Layout me */}
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan-application"
          element={
            <ProtectedRoute>
              <ArtisanApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/:id"
          element={
            <ProtectedRoute>
              <ArtisanProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-service"
          element={
            <ProtectedRoute>
              <ServiceBookingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio-manager"
          element={
            <ProtectedRoute>
              <ArtisanPortfolioManager />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
