// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import ArtisanCard from './ArtisanCard.jsx';
// import OrderCard from './OrderCard.jsx';

// const CustomerDashboard = ({ user }) => {
//   const navigate = useNavigate();
//   const [artisans, setArtisans] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loadingArtisans, setLoadingArtisans] = useState(true);
//   const [loadingOrders, setLoadingOrders] = useState(true);

//   useEffect(() => {
//     const fetchArtisans = async () => {
//       try {
//         const token = localStorage.getItem('craftconnect_token');
//         const config = { headers: { 'x-auth-token': token } };
//         const res = await axios.get('http://localhost:5000/api/users/artisans', config);
//         setArtisans(res.data);
//       } catch (error) {
//         console.error("Could not fetch artisans", error);
//       } finally {
//         setLoadingArtisans(false);
//       }
//     };

//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem('craftconnect_token');
//         const config = { headers: { 'x-auth-token': token } };
//         const res = await axios.get('http://localhost:5000/api/bookings/my-orders', config);
//         setOrders(res.data);
//       } catch (error) {
//         console.error("Could not fetch orders", error);
//       } finally {
//         setLoadingOrders(false);
//       }
//     };

//     fetchArtisans();
//     fetchOrders();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('craftconnect_token');
//     alert('You have been logged out.');
//     navigate('/login');
//   };

//   const groupedArtisans = artisans.reduce((acc, artisan) => {
//     const category = artisan.artisanInfo.serviceCategory;
//     if (!acc[category]) acc[category] = [];
//     acc[category].push(artisan);
//     return acc;
//   }, {});

//   return (
//     <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h2>
//         <button
//           onClick={handleLogout}
//           className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//         >
//           Logout
//         </button>
//       </div>

//       {/* My Bookings */}
//       <section className="mb-10">
//         <h3 className="text-xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">My Bookings</h3>
//         {loadingOrders ? (
//           <p className="text-gray-500">Loading your bookings...</p>
//         ) : orders.length > 0 ? (
//           <div className="grid gap-4">
//             {orders.map(order => <OrderCard key={order._id} order={order} />)}
//           </div>
//         ) : (
//           <p className="text-gray-500">You have not made any bookings yet.</p>
//         )}
//       </section>

//       {/* Browse Artisans */}
//       <section>
//         <h3 className="text-xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">Browse & Book Artisans</h3>
//         {loadingArtisans ? (
//           <p className="text-gray-500">Loading artisans...</p>
//         ) : (
//           Object.keys(groupedArtisans).length > 0 ? (
//             Object.keys(groupedArtisans).map(category => (
//               <div key={category} className="mb-8">
//                 <h4 className="text-lg font-medium text-blue-600 mb-3">{category}</h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {groupedArtisans[category].map(artisan => (
//                     <ArtisanCard key={artisan._id} artisan={artisan} />
//                   ))}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No artisans found at the moment.</p>
//           )
//         )}
//       </section>
//     </div>
//   );
// };

// export default CustomerDashboard;
// client/src/components/CustomerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArtisanCard from './ArtisanCard.jsx';
import OrderCard from './OrderCard.jsx';
const getReadableLocation = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await res.json();
    return (
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.state ||
      ""
    );
  } catch (err) {
    console.error("Reverse geocoding failed", err);
    return "";
  }
};


const CustomerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingArtisans, setLoadingArtisans] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [payments, setPayments] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [availability, setAvailability] = useState('');
  const [experience, setExperience] = useState('');
  const [rating, setRating] = useState('');
const token = localStorage.getItem('craftconnect_token');

  const handleDetectLocation = () => {
  if (!navigator.geolocation) {
    alert("Your browser does not support location access.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      const loc = await getReadableLocation(latitude, longitude);
      if (loc) {
        setSelectedLocation(loc);
      } else {
        alert("Could not detect location.");
      }
    },
    () => {
      alert("Permission denied. Please allow location access.");
    }
  );
};

  const fetchArtisans = async () => {
    try {
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
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('http://localhost:5000/api/bookings/my-orders', config);
      setOrders(res.data);
    } catch (error) {
      console.error("Could not fetch orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('http://localhost:5000/api/payments/history', config);
      setPayments(res.data || []);
    } catch (error) {
      console.error('Could not fetch payments', error);
    }
  };

  const fetchWallet = async () => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('http://localhost:5000/api/payments/wallet', config);
      setWallet(res.data);
    } catch (error) {
      console.error('Could not fetch wallet', error);
    }
  };

  useEffect(() => {
    fetchArtisans();
    fetchOrders();
    fetchPayments();
    fetchWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('craftconnect_token');
    alert('You have been logged out.');
    navigate('/login');
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchText('');
    setSelectedLocation('');
    setPriceRange('');
    setAvailability('');
    setExperience('');
    setRating('');
  };

  // Filtered Artisans
  const filteredArtisans = artisans.filter(artisan => {
    const matchesCategory = selectedCategory ? artisan.artisanInfo.serviceCategory === selectedCategory : true;
    const matchesLocation = selectedLocation ? artisan.artisanInfo.location.toLowerCase().includes(selectedLocation.toLowerCase()) : true;
    const matchesSearch = searchText ? artisan.name.toLowerCase().includes(searchText.toLowerCase()) : true;
    
    // Price range filter
    const matchesPrice = priceRange ? (() => {
      const hourlyRate = artisan.artisanInfo.hourlyRate || 0;
      switch(priceRange) {
        case 'budget': return hourlyRate < 500;
        case 'medium': return hourlyRate >= 500 && hourlyRate < 1000;
        case 'premium': return hourlyRate >= 1000;
        default: return true;
      }
    })() : true;
    
    // Experience filter
    const matchesExperience = experience ? (() => {
      const exp = artisan.artisanInfo.experienceYears || 0;
      switch(experience) {
        case 'beginner': return exp < 2;
        case 'intermediate': return exp >= 2 && exp < 5;
        case 'expert': return exp >= 5;
        default: return true;
      }
    })() : true;
    
    // Rating filter
    const matchesRating = rating ? (() => {
      const artisanRating = artisan.artisanInfo.rating || 0;
      return artisanRating >= parseFloat(rating);
    })() : true;
    
    // Availability filter (assuming we have availability data)
    const matchesAvailability = availability ? (() => {
      if (availability === 'available') return artisan.artisanInfo.isAvailable !== false;
      if (availability === 'busy') return artisan.artisanInfo.isAvailable === false;
      return true;
    })() : true;
    
    return matchesCategory && matchesLocation && matchesSearch && matchesPrice && matchesExperience && matchesRating && matchesAvailability;
  });

  // Group by category
  const groupedFilteredArtisans = filteredArtisans.reduce((acc, artisan) => {
    const category = artisan.artisanInfo.serviceCategory;
    if (!acc[category]) acc[category] = [];
    acc[category].push(artisan);
    return acc;
  }, {});
   const handleRatingUpdate = (artisanId, newRating) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.artisan._id === artisanId
          ? {
              ...order,
              artisan: {
                ...order.artisan,
                artisanInfo: { ...order.artisan.artisanInfo, rating: newRating }
              }
            }
          : order
      )
    );
  };

  const hasActiveFilters = selectedCategory || searchText || selectedLocation || priceRange || availability || experience || rating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Welcome, {user.name}! 👋
              </h1>
              <p className="text-gray-600 text-lg">Find & book skilled artisans for your creative projects</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{orders.length}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Available Artisans</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{artisans.length}</p>
              </div>
              <div className="text-4xl">👨‍🎨</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Bookings</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {orders.filter(o => o.status === 'Confirmed' || o.status === 'Work In Progress').length}
                </p>
              </div>
              <div className="text-4xl">⚡</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Categories</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {new Set(artisans.map(a => a.artisanInfo?.serviceCategory)).size}
                </p>
              </div>
              <div className="text-4xl">🏆</div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📦 Recent Orders</h2>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{orders.length} total</span>
            </div>
            {loadingOrders ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-3">Loading your orders...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map(order => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    token={token}
                    onRatingUpdate={handleRatingUpdate}
                    payments={payments}
                    wallet={wallet}
                    refreshPayments={fetchPayments}
                    refreshWallet={fetchWallet}
                    refreshOrders={fetchOrders}
                  />
                ))}
                {orders.length > 3 && (
                  <button className="w-full mt-4 py-3 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                    View all {orders.length} orders →
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {/* Search and Filters */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🔍 Find Artisans</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {showFilters ? '✓ Filters Active' : '+ More Filters'}
            </button>
          </div>
          
          {/* Main Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔎 Search by artisan name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            />
          </div>

          {/* Additional Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t-2 border-gray-100">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🏆 Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All categories</option>
                  {Array.from(new Set(artisans.map(a => a.artisanInfo?.serviceCategory).filter(Boolean))).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                  <span>📍 Location</span>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="text-xs text-blue-600 hover:underline font-normal"
                  >
                    Auto-detect
                  </button>
                </label>
                <input
                  type="text"
                  placeholder="City or area..."
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  💰 Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any budget</option>
                  <option value="budget">Budget (Under ₹500/hr)</option>
                  <option value="medium">Medium (₹500-₹1000/hr)</option>
                  <option value="premium">Premium (₹1000+ /hr)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🎯 Experience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any experience</option>
                  <option value="beginner">Beginner (0-2 years)</option>
                  <option value="intermediate">Intermediate (2-5 years)</option>
                  <option value="expert">Expert (5+ years)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ⭐ Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📅 Availability
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any availability</option>
                  <option value="available">Available now</option>
                  <option value="busy">Busy/Booked</option>
                </select>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-3 mt-6 pt-6 border-t-2 border-gray-100 flex-wrap">
              <span className="text-sm font-bold text-gray-700">Applied:</span>
              {selectedCategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-semibold">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')} className="ml-2 hover:text-blue-900">✕</button>
                </span>
              )}
              {selectedLocation && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 font-semibold">
                  📍 {selectedLocation}
                  <button onClick={() => setSelectedLocation('')} className="ml-2 hover:text-green-900">✕</button>
                </span>
              )}
              {priceRange && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 font-semibold">
                  💰 {priceRange}
                  <button onClick={() => setPriceRange('')} className="ml-2 hover:text-purple-900">✕</button>
                </span>
              )}
              {experience && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 font-semibold">
                  🎯 {experience}
                  <button onClick={() => setExperience('')} className="ml-2 hover:text-yellow-900">✕</button>
                </span>
              )}
              {rating && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800 font-semibold">
                  ⭐ {rating}+ stars
                  <button onClick={() => setRating('')} className="ml-2 hover:text-orange-900">✕</button>
                </span>
              )}
              {availability && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 font-semibold">
                  📅 {availability}
                  <button onClick={() => setAvailability('')} className="ml-2 hover:text-indigo-900">✕</button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-semibold ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        {/* Artisans List */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {hasActiveFilters ? '🔎 Search Results' : '✨ All Artisans'}
            </h2>
            <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold">
              {filteredArtisans.length} found
            </span>
          </div>

          {loadingArtisans ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4 text-lg">Loading artisans...</p>
            </div>
          ) : Object.keys(groupedFilteredArtisans).length > 0 ? (
            Object.keys(groupedFilteredArtisans).map(category => (
              <div key={category} className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {category}
                  </h3>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
                    {groupedFilteredArtisans[category].length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedFilteredArtisans[category].map(artisan => (
                    <ArtisanCard key={artisan._id} artisan={artisan} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No artisans found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters to find what you're looking for</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CustomerDashboard;