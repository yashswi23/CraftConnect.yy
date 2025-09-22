import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ArtisanProfile = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [artisan, setArtisan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtisanDetails = async () => {
            try {
                const token = localStorage.getItem('craftconnect_token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('http://localhost:5000/api/users/artisans', config);
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
            await axios.post('http://localhost:5000/api/bookings', { artisanId: id }, config);
            alert('Booking request sent successfully!');
            navigate('/dashboard');
        } catch (error) {
            alert('Error: ' + (error.response ? error.response.data.msg : 'Could not book visit.'));
        }
    };

    if (loading) return <div className="text-center mt-10">Loading Profile...</div>;
    if (!artisan) return <div className="text-center mt-10">Sorry, Artisan not found.</div>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">{artisan.name}'s Profile</h2>
            <div className="text-left border p-4 rounded-md mb-4 bg-gray-50">
                <p><strong>Service Category:</strong> {artisan.artisanInfo.serviceCategory}</p>
                <p><strong>Location:</strong> {artisan.artisanInfo.location}</p>
                <p><strong>Email:</strong> {artisan.email}</p>
            </div>
            <button
                onClick={handleBookVisit}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
                Book a Visit
            </button>
        </div>
    );
};

export default ArtisanProfile;
