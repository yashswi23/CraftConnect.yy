import React from 'react';

const BookingCard = ({ booking, onStatusUpdate }) => {
    const getNextAction = (status) => {
        switch (status) {
            case 'Pending Confirmation':
                return { action: 'Confirm Booking', nextStatus: 'Confirmed' };
            case 'Confirmed':
                return { action: 'Start Journey (On The Way)', nextStatus: 'On The Way' };
            case 'On The Way':
                return { action: 'Arrived at Location', nextStatus: 'Arrived' };
            case 'Arrived':
                return { action: 'Start Work', nextStatus: 'Work In Progress' };
            case 'Work In Progress':
                return { action: 'Mark as Work Complete', nextStatus: 'Work Complete' };
            default:
                return null;
        }
    };

    const nextAction = getNextAction(booking.status);

    return (
        <div className="border border-blue-500 rounded-lg p-4 mb-4 bg-white shadow hover:shadow-md transition">
            <h4 className="text-lg font-semibold mb-2">Booking from: {booking.customer.name}</h4>
            <p className="text-gray-700"><strong>Customer Email:</strong> {booking.customer.email}</p>
            <p className="text-gray-700"><strong>Booked On:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
            <p className="text-gray-700">
                <strong>Current Status: </strong>
                <span className="font-bold text-red-600">{booking.status}</span>
            </p>
            {nextAction && (
                <button
                    onClick={() => onStatusUpdate(booking._id, nextAction.nextStatus)}
                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    {nextAction.action}
                </button>
            )}
        </div>
    );
};

export default BookingCard;
