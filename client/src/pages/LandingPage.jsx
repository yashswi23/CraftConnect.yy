import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md hover:bg-white/10 transition">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Now Live • Trusted by 10K+ Users</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  Connect
                </span>
                <br />
                <span className="text-white">with Artisans</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                  Instantly
                </span>
              </h1>
              <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                The AI-powered platform connecting customers with skilled artisans. Safe payments, verified profiles, 
                <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text"> real-time tracking</span>.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link
                to="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <span className="relative flex items-center gap-2">
                  🚀 Get Started Free
                </span>
              </Link>
              <Link
                to="/login"
                className="group px-8 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Sign In →
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-xl">✓</span> 10K+ Happy Users
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">✓</span> Secure Escrow Payments
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">✓</span> Verified Artisans
              </div>
            </div>
          </div>

          {/* Floating cards showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="group relative p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative space-y-4">
                <div className="text-4xl">💰</div>
                <h3 className="text-xl font-bold text-white">Secure Payments</h3>
                <p className="text-gray-400">Money held in escrow until work is complete</p>
              </div>
            </div>
            <div className="group relative p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative space-y-4">
                <div className="text-4xl">⭐</div>
                <h3 className="text-xl font-bold text-white">Verified Profiles</h3>
                <p className="text-gray-400">All artisans verified and rated by real users</p>
              </div>
            </div>
            <div className="group relative p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative space-y-4">
                <div className="text-4xl">📱</div>
                <h3 className="text-xl font-bold text-white">Real-Time Tracking</h3>
                <p className="text-gray-400">Track your bookings from start to finish</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              Why <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">CraftConnect</span>?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need for a seamless artisan-customer experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🎨',
                title: 'For Artisans',
                desc: 'Showcase your portfolio, get discovered, manage bookings, and grow your business with zero commission.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: '🛍️',
                title: 'For Customers',
                desc: 'Find verified artisans, book instantly, track progress in real-time, and rate your experience.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: '🔒',
                title: 'Secure & Safe',
                desc: 'Escrow payments protect both parties. Verified profiles and ratings build trust in our community.',
                color: 'from-cyan-500 to-blue-500'
              },
              {
                icon: '💼',
                title: 'Portfolio Management',
                desc: 'Artisans can showcase their best work with high-quality images and detailed descriptions.',
                color: 'from-green-500 to-cyan-500'
              },
              {
                icon: '📊',
                title: 'Smart Analytics',
                desc: 'Track earnings, monitor ratings, and optimize your artisan profile for maximum visibility.',
                color: 'from-pink-500 to-purple-500'
              },
              {
                icon: '🌍',
                title: 'Location-Based',
                desc: 'Find artisans near you with distance filtering and location-aware recommendations.',
                color: 'from-orange-500 to-pink-500'
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative space-y-4">
                  <div className="text-5xl">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Active Users', icon: '👥' },
              { value: '5K+', label: 'Verified Artisans', icon: '👨‍🎨' },
              { value: '50K+', label: 'Projects Completed', icon: '✅' },
              { value: '4.9★', label: 'Average Rating', icon: '⭐' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-3 p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                <div className="text-4xl">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 rounded-3xl backdrop-blur-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>
            <div className="relative space-y-6 text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-white">
                Ready to Join?
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Whether you're an artisan looking to grow or a customer seeking skilled professionals, 
                CraftConnect has you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Link
                  to="/register"
                  className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/50 text-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <span className="relative">Start Free →</span>
                </Link>
                <Link
                  to="/login"
                  className="px-10 py-4 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-lg"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2025 CraftConnect. Connecting artisans and customers worldwide. 🚀</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
