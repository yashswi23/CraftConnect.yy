import React from 'react';
import { Link } from 'react-router-dom';

const ArtisanCard = ({ artisan }) => {
    return (
        <Link
            to={`/artisan/${artisan._id}`}
            className="block border rounded-lg p-4 m-2 w-60 bg-white shadow hover:shadow-lg hover:scale-105 transform transition-all text-left no-underline text-gray-800"
        >
            <p className="text-blue-700 font-bold text-lg mb-2">{artisan.name}</p>
            <p className="text-gray-700 text-sm mb-1"><strong>Service:</strong> {artisan.artisanInfo.serviceCategory}</p>
            <p className="text-gray-700 text-sm"><strong>Location:</strong> {artisan.artisanInfo.location}</p>
        </Link>
    );
};

export default ArtisanCard;
