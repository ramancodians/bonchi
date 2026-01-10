
import React from 'react';

const HospitalAppointments = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Appointments</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold">Upcoming Appointments</h2>
                    <button className="btn btn-outline btn-sm">View History</button>
                </div>
                <p className="text-gray-500 text-center py-8">No appointments found.</p>
            </div>
        </div>
    );
};

export default HospitalAppointments;
