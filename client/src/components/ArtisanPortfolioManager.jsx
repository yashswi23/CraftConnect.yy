
// client/src/components/ArtisanPortfolioManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ArtisanPortfolioManager = () => {
    const [profileData, setProfileData] = useState({
        bio: '',
        skills: [],
        experience: '',
        portfolio: []
    });

    const [formData, setFormData] = useState({
        bio: '',
        skillInput: '',
        experience: ''
    });

    const [newWork, setNewWork] = useState({
        title: '',
        description: '',
        image: null
    });

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const API_BASE = 'http://localhost:5000';

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('craftconnect_token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get(`${API_BASE}/api/portfolio/my-profile`, config);
            setProfileData(res.data);
            setFormData({
                bio: res.data.bio || '',
                skillInput: '',
                experience: res.data.experience || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('Could not load your profile');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('craftconnect_token');
            const config = { headers: { 'x-auth-token': token } };
            
            await axios.put(
                `${API_BASE}/api/portfolio/update-profile`,
                {
                    bio: formData.bio,
                    skills: profileData.skills,
                    experience: formData.experience
                },
                config
            );
            
            alert('Profile updated successfully!');
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const handleAddSkill = () => {
        if (formData.skillInput.trim() && !profileData.skills.includes(formData.skillInput.trim())) {
            setProfileData({
                ...profileData,
                skills: [...profileData.skills, formData.skillInput.trim()]
            });
            setFormData({ ...formData, skillInput: '' });
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setProfileData({
            ...profileData,
            skills: profileData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleAddWork = async (e) => {
        e.preventDefault();
        
        if (!newWork.title.trim()) {
            alert('Please enter a title for your work');
            return;
        }

        setUploading(true);
        
        try {
            const token = localStorage.getItem('craftconnect_token');
            const formDataToSend = new FormData();
            formDataToSend.append('title', newWork.title);
            formDataToSend.append('description', newWork.description);
            
            if (newWork.image) {
                formDataToSend.append('image', newWork.image);
            }

            const config = {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            };

            await axios.post(`${API_BASE}/api/portfolio/add-work`, formDataToSend, config);
            
            alert('Work added to portfolio!');
            setNewWork({ title: '', description: '', image: null });
            fetchProfile();
        } catch (error) {
            console.error('Error adding work:', error);
            alert('Failed to add work to portfolio');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteWork = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this work?')) {
            return;
        }

        try {
            const token = localStorage.getItem('craftconnect_token');
            const config = { headers: { 'x-auth-token': token } };
            
            await axios.delete(`${API_BASE}/api/portfolio/delete-work/${itemId}`, config);
            alert('Work deleted from portfolio!');
            fetchProfile();
        } catch (error) {
            console.error('Error deleting work:', error);
            alert('Failed to delete work');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading your portfolio...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                    📸 Manage Your Portfolio
                </h1>

                {/* Profile Information Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Information</h2>
                    
                    <form onSubmit={handleProfileUpdate}>
                        {/* Bio */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">
                                About Me / Bio
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                                maxLength="500"
                                placeholder="Tell customers about yourself and your expertise..."
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {formData.bio.length}/500 characters
                            </p>
                        </div>

                        {/* Experience */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Years of Experience
                            </label>
                            <input
                                type="text"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 5 years"
                            />
                        </div>

                        {/* Skills */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Skills
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={formData.skillInput}
                                    onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add a skill..."
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profileData.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="text-red-600 hover:text-red-800 font-bold"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                        >
                            💾 Save Profile Information
                        </button>
                    </form>
                </div>

                {/* Add New Work Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Work</h2>
                    
                    <form onSubmit={handleAddWork}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Work Title *
                            </label>
                            <input
                                type="text"
                                value={newWork.title}
                                onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Custom Wooden Chair"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Description
                            </label>
                            <textarea
                                value={newWork.description}
                                onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Describe this work..."
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Upload Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setNewWork({ ...newWork, image: e.target.files[0] })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {newWork.image && (
                                <p className="text-sm text-green-600 mt-2">
                                    ✓ Selected: {newWork.image.name}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition disabled:bg-gray-400"
                        >
                            {uploading ? '⏳ Uploading...' : '➕ Add to Portfolio'}
                        </button>
                    </form>
                </div>

                {/* Portfolio Gallery */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        My Portfolio ({profileData.portfolio.length} items)
                    </h2>

                    {profileData.portfolio.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">No portfolio items yet.</p>
                            <p className="text-sm mt-2">Add your first work to showcase your skills!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {profileData.portfolio.map((item) => (
                                <div
                                    key={item._id}
                                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                                >
                                    {item.imageUrl && (
                                        <img
                                            src={`${API_BASE}${item.imageUrl}`}
                                            alt={item.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            {item.title}
                                        </h3>
                                        {item.description && (
                                            <p className="text-gray-600 text-sm mb-3">
                                                {item.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mb-3">
                                            Added: {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                        <button
                                            onClick={() => handleDeleteWork(item._id)}
                                            className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtisanPortfolioManager;
