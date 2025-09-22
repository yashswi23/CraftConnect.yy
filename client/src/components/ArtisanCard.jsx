import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ArtisanCard = ({ artisan }) => {
    const [rating, setRating] = useState(artisan.artisanInfo.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleRate = async (star) => {
        try {
            const token = localStorage.getItem('craftconnect_token');
            const config = {
                headers: { 'x-auth-token': token }
            };
            const res = await axios.post(
                `http://localhost:5000/api/users/rate/${artisan._id}`,
                { rating: star },
                config
            );
            setRating(res.data.rating); // update average rating
            alert('Rating submitted!');
        } catch (err) {
            console.error(err);
            alert('Failed to submit rating.');
        }
    };

    return (
        <div className="block border rounded-lg p-4 m-2 w-60 bg-white shadow hover:shadow-lg hover:scale-105 transform transition-all text-left text-gray-800">
            <Link to={`/artisan/${artisan._id}`} className="no-underline text-gray-800">
                <p className="text-blue-700 font-bold text-lg mb-2">{artisan.name}</p>
                <p className="text-gray-700 text-sm mb-1">
                    <strong>Service:</strong> {artisan.artisanInfo.serviceCategory}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                    <strong>Location:</strong> {artisan.artisanInfo.location}
                </p>
            </Link>

            {/* Rating Stars */}
            <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRate(star)}
                        className={`text-xl ${
                            star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    >
                        ★
                    </button>
                ))}
            </div>
            <p className="text-sm text-gray-500">
                Average Rating: {rating.toFixed(1)} ⭐ ({artisan.artisanInfo.totalRatings || 0} ratings)
            </p>
        </div>
    );
};

export default ArtisanCard;
