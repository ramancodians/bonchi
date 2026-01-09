
import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-semibold text-gray-500 mb-2">Total Customers</h2>
                    <p className="text-3xl font-bold text-blue-600">...</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-semibold text-gray-500 mb-2">Total Partners</h2>
                    <p className="text-3xl font-bold text-green-600">...</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-semibold text-gray-500 mb-2">Support Requests</h2>
                    <p className="text-3xl font-bold text-orange-600">...</p>
                </div>
            </div>
            <p className="mt-8 text-gray-500 text-center">More analytics coming soon.</p>
        </div>
    );
};

export default AdminDashboard;
