import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to CraftConnect</h1>
        <p className="text-lg max-w-2xl mb-6">
          A platform to connect skilled artisans with customers. Book trusted services, 
          grow your craft business, and manage everything in one place.
        </p>
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose CraftConnect?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-3">For Customers</h3>
            <p className="text-gray-600">
              Discover artisans near you, book services with ease, and track your orders in real-time.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-3">For Artisans</h3>
            <p className="text-gray-600">
              Showcase your skills, grow your business, and manage bookings efficiently.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-3">For Admins</h3>
            <p className="text-gray-600">
              Monitor activity, approve artisans, and ensure platform safety and quality.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-indigo-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6">Join thousands of artisans and customers today.</p>
        <Link
          to="/register"
          className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
        >
          Join Now
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
