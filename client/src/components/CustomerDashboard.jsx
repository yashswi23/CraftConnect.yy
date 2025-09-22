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

const CustomerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingArtisans, setLoadingArtisans] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
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
  useEffect(() => {
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

    fetchArtisans();
    fetchOrders();
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Hey {user.name}
              </h1>
              <p className="text-gray-600">Find skilled artisans for your projects</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
            <div className="text-sm text-gray-600">Total orders</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{artisans.length}</div>
            <div className="text-sm text-gray-600">Available artisans</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-900">
              {orders.filter(o => o.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Active bookings</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-900">
              {new Set(artisans.map(a => a.artisanInfo?.serviceCategory)).size}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
            {loadingOrders ? (
              <div className="text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map(order => (
                  <OrderCard key={order._id} order={order}  token={token}  onRatingUpdate={handleRatingUpdate}/>
                ))}
                {orders.length > 3 && (
                  <button className="text-blue-600 text-sm hover:text-blue-700">
                    View all {orders.length} orders →
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {/* Search and Filters */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Find Artisans</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {showFilters ? 'Hide filters' : 'More filters'}
            </button>
          </div>
          
          {/* Main Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by artisan name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Additional Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All categories</option>
                  {Array.from(new Set(artisans.map(a => a.artisanInfo?.serviceCategory).filter(Boolean))).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any budget</option>
                  <option value="budget">Budget (Under ₹500/hr)</option>
                  <option value="medium">Medium (₹500-₹1000/hr)</option>
                  <option value="premium">Premium (₹1000+ /hr)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any experience</option>
                  <option value="beginner">Beginner (0-2 years)</option>
                  <option value="intermediate">Intermediate (2-5 years)</option>
                  <option value="expert">Expert (5+ years)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 flex-wrap">
              <span className="text-sm text-gray-600">Filters:</span>
              {selectedCategory && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-1 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedLocation && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  📍 {selectedLocation}
                  <button
                    onClick={() => setSelectedLocation('')}
                    className="ml-1 hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {priceRange && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  💰 {priceRange}
                  <button
                    onClick={() => setPriceRange('')}
                    className="ml-1 hover:text-purple-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {experience && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  🎯 {experience}
                  <button
                    onClick={() => setExperience('')}
                    className="ml-1 hover:text-yellow-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {rating && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  ⭐ {rating}+ stars
                  <button
                    onClick={() => setRating('')}
                    className="ml-1 hover:text-orange-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {availability && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                  📅 {availability}
                  <button
                    onClick={() => setAvailability('')}
                    className="ml-1 hover:text-indigo-900"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-gray-700 ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        {/* Artisans List */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {hasActiveFilters ? 'Search Results' : 'All Artisans'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredArtisans.length} artisan{filteredArtisans.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loadingArtisans ? (
            <div className="text-center py-8 text-gray-500">Loading artisans...</div>
          ) : Object.keys(groupedFilteredArtisans).length > 0 ? (
            Object.keys(groupedFilteredArtisans).map(category => (
              <div key={category} className="mb-8">
                <h3 className="text-md font-medium text-gray-800 mb-3 border-b border-gray-200 pb-1">
                  {category} ({groupedFilteredArtisans[category].length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedFilteredArtisans[category].map(artisan => (
                    <ArtisanCard key={artisan._id} artisan={artisan} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">
                {hasActiveFilters ? 'No artisans match your search' : 'No artisans found'}
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 text-sm hover:text-blue-700"
                >
                  Clear filters to see all artisans
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