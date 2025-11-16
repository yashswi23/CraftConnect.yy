// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const AdminDashboard = () => {
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem('craftconnect_token');

//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         const config = { headers: { 'x-auth-token': token } };
//         const res = await axios.get('http://localhost:5000/api/users/artisan-applications', config);
//         setApplications(res.data);
//       } catch (err) {
//         alert('Failed to load applications');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchApplications();
//   }, [token]);

//   const handleUpdateStatus = async (id, action) => {
//     try {
//       const config = { headers: { 'x-auth-token': token } };
//       const url = `http://localhost:5000/api/users/${action}-artisan/${id}`;
//       await axios.put(url, {}, config);
//       alert(`Artisan ${action}ed successfully`);
//       setApplications(applications.filter(app => app._id !== id));
//     } catch (err) {
//       alert('Operation failed');
//     }
//   };

//   if (loading) return <div className="text-center text-gray-500 mt-10">Loading artisan applications...</div>;
//   if (applications.length === 0) return <div className="text-center text-gray-500 mt-10">No pending artisan applications.</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Pending Artisan Applications</h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2 text-left text-gray-700">Name</th>
//               <th className="px-4 py-2 text-left text-gray-700">Email</th>
//               <th className="px-4 py-2 text-left text-gray-700">Location</th>
//               <th className="px-4 py-2 text-left text-gray-700">Service Category</th>
//               <th className="px-4 py-2 text-left text-gray-700">Aadhaar Number</th>
//               <th className="px-4 py-2 text-center text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {applications.map(app => (
//               <tr key={app._id} className="border-t border-gray-200 hover:bg-gray-50">
//                 <td className="px-4 py-2">{app.name}</td>
//                 <td className="px-4 py-2">{app.email}</td>
//                 <td className="px-4 py-2">{app.artisanInfo.location}</td>
//                 <td className="px-4 py-2">{app.artisanInfo.serviceCategory}</td>
//                 <td className="px-4 py-2">{app.artisanInfo.aadhaarNumber}</td>
//                 <td className="px-4 py-2 text-center">
//                   <button
//                     onClick={() => handleUpdateStatus(app._id, 'approve')}
//                     className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => handleUpdateStatus(app._id, 'reject')}
//                     className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                   >
//                     Reject
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem('craftconnect_token');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/users/artisan-applications', config);
        setApplications(res.data);
      } catch (err) {
        console.log(err);
        alert('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  const handleUpdateStatus = async (id, action) => {
    setUpdatingId(id);
    try {
      const config = { headers: { 'x-auth-token': token } };
      const url = `http://localhost:5000/api/users/${action}-artisan/${id}`;

      await axios.put(url, {}, config);

      setApplications(prev =>
        prev.filter(app => app._id !== id)
      );

      alert(`Artisan ${action}ed successfully`);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert('Operation failed — check console');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20 text-lg text-gray-600">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mr-3"></div>
        Loading artisan applications...
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-12">
        <h2 className="text-xl font-semibold">No pending artisan applications</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Pending Artisan Applications
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Location</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Service</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Aadhaar</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.map(app => (
              <tr key={app._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3">{app.name}</td>
                <td className="px-4 py-3">{app.email}</td>
                <td className="px-4 py-3">{app.artisanInfo.location}</td>
                <td className="px-4 py-3">{app.artisanInfo.serviceCategory}</td>
                <td className="px-4 py-3">{app.artisanInfo.aadhaarNumber}</td>

                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    disabled={updatingId === app._id}
                    onClick={() => handleUpdateStatus(app._id, 'approve')}
                    className={`px-3 py-1 rounded text-white 
                      ${updatingId === app._id ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {updatingId === app._id ? "Processing..." : "Approve"}
                  </button>

                  <button
                    disabled={updatingId === app._id}
                    onClick={() => handleUpdateStatus(app._id, 'reject')}
                    className={`px-3 py-1 rounded text-white 
                      ${updatingId === app._id ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {updatingId === app._id ? "Processing..." : "Reject"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;