import React from 'react';

const OrderCard = ({ order }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending Confirmation':
            case 'Confirmed': return 'bg-yellow-400 text-yellow-800';
            case 'On The Way':
            case 'Arrived':
            case 'Work In Progress': return 'bg-blue-400 text-blue-800';
            case 'Work Complete':
            case 'Payment Done': return 'bg-green-400 text-green-800';
            case 'Cancelled': return 'bg-red-400 text-red-800';
            default: return 'bg-gray-400 text-gray-800';
        }
    };

    return (
        <div className={`border-l-4 ${getStatusColor(order.status)} rounded-lg p-4 mb-4 bg-white shadow`}>
            <h4 className="text-lg font-semibold mb-2">Booking with: {order.artisan.name}</h4>
            <p className="text-gray-700"><strong>Service:</strong> {order.artisan.artisanInfo.serviceCategory}</p>
            <p className="text-gray-700"><strong>Booked On:</strong> {new Date(order.bookingDate).toLocaleDateString()}</p>
            <p className="text-gray-700">
                <strong>Live Status: </strong>
                <span className="font-bold">{order.status}</span>
            </p>
        </div>
    );
};

export default OrderCard;
