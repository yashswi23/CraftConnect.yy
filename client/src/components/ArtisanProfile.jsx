import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ArtisanProfile = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [artisan, setArtisan] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_BASE = 'http://localhost:5000';

    useEffect(() => {
        const fetchArtisanDetails = async () => {
            try {
                const token = localStorage.getItem('craftconnect_token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get(`${API_BASE}/api/users/artisans`, config);
                const foundArtisan = res.data.find(art => art._id === id);
                setArtisan(foundArtisan);
            } catch (error) {
                console.error("Artisan details not found", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtisanDetails();
    }, [id]);

    const handleBookVisit = async () => {
        try {
            const token = localStorage.getItem('craftconnect_token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.post(`${API_BASE}/api/bookings`, { artisanId: id }, config);
            alert('Booking request sent successfully!');
            navigate('/dashboard');
        } catch (error) {
            alert('Error: ' + (error.response ? error.response.data.msg : 'Could not book visit.'));
        }
    };

    if (loading) return <div className="text-center mt-10">Loading Profile...</div>;
    if (!artisan) return <div className="text-center mt-10">Sorry, Artisan not found.</div>;

    const { artisanInfo } = artisan;
    const portfolio = artisanInfo?.portfolio || [];
    const skills = artisanInfo?.skills || [];
    const bio = artisanInfo?.bio || '';
    const experience = artisanInfo?.experience || '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    {artisan.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-800">{artisan.name}</h1>
                                    <p className="text-xl text-gray-600">{artisanInfo.serviceCategory}</p>
                                </div>
                            </div>

                            {/* Rating Display */}
                            {artisanInfo.totalRatings > 0 && (
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex text-yellow-400">
                                        {'★'.repeat(Math.round(artisanInfo.rating))}
                                        {'☆'.repeat(5 - Math.round(artisanInfo.rating))}
                                    </div>
                                    <span className="text-gray-600">
                                        {artisanInfo.rating.toFixed(1)} ({artisanInfo.totalRatings} ratings)
                                    </span>
                                </div>
                            )}

                            {/* Bio */}
                            {bio && (
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">About Me</h3>
                                    <p className="text-gray-700">{bio}</p>
                                </div>
                            )}

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">📍 Location</p>
                                    <p className="font-semibold text-gray-800">{artisanInfo.location}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">✉️ Email</p>
                                    <p className="font-semibold text-gray-800">{artisan.email}</p>
                                </div>
                                {experience && (
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">⏱️ Experience</p>
                                        <p className="font-semibold text-gray-800">{experience}</p>
                                    </div>
                                )}
                            </div>

                            {/* Skills */}
                            {skills.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-800 mb-3">🛠️ Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleBookVisit}
                        className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        📅 Book a Visit
                    </button>
                </div>

                {/* Portfolio Section */}
                {portfolio.length > 0 && (
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            📸 Portfolio ({portfolio.length} {portfolio.length === 1 ? 'item' : 'items'})
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {portfolio.map((item) => (
                                <div
                                    key={item._id}
                                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                    {item.imageUrl && (
                                        <img
                                            src={`${API_BASE}${item.imageUrl}`}
                                            alt={item.title}
                                            className="w-full h-56 object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                            }}
                                        />
                                    )}
                                    <div className="p-4 bg-gray-50">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                                            {item.title}
                                        </h3>
                                        {item.description && (
                                            <p className="text-gray-600 text-sm mb-2">
                                                {item.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400">
                                            Added: {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {portfolio.length === 0 && (
                    <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                        <p className="text-gray-500 text-lg">This artisan hasn't added any portfolio items yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtisanProfile;
