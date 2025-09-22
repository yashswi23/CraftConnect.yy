import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ArtisanApplication = () => {
    const [formData, setFormData] = useState({ location: '', aadhaarNumber: '', serviceCategory: '' });
    const navigate = useNavigate();
    const { location, aadhaarNumber, serviceCategory } = formData;

    const categories = ['Pottery', 'Painting', 'Handicrafts', 'Weaving', 'Jewellery Making', 'Other'];

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('craftconnect_token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.put('http://localhost:5000/api/users/become-artisan', formData, config);
            alert(res.data.msg);
            navigate('/dashboard');
        } catch (err) {
            alert('Error: ' + err.response.data.msg);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Artisan Application Form</h2>
            <p className="mb-6 text-center text-gray-600">Please provide your details to get approved.</p>
            <form onSubmit={onSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Your Location (City, State)"
                    name="location"
                    value={location}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="text"
                    placeholder="Aadhaar Number"
                    name="aadhaarNumber"
                    value={aadhaarNumber}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                    name="serviceCategory"
                    value={serviceCategory}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="" disabled>-- Select Your Service --</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Submit Application
                </button>
            </form>
        </div>
    );
};

export default ArtisanApplication;
