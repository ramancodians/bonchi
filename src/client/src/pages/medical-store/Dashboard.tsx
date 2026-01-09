
import React from 'react';
import { FaBoxOpen, FaClipboardList, FaPlusCircle } from 'react-icons/fa';

const MedicalStoreDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Medical Store Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="stats shadow bg-white">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <FaBoxOpen size={30} />
                        </div>
                        <div className="stat-title">Total Orders</div>
                        <div className="stat-value text-primary">0</div>
                        <div className="stat-desc">Pending processing</div>
                    </div>
                </div>

                <div className="stats shadow bg-white">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <FaClipboardList size={30} />
                        </div>
                        <div className="stat-title">Inventory Items</div>
                        <div className="stat-value text-secondary">0</div>
                        <div className="stat-desc">Low stock alert in 0 items</div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl border border-dashed border-gray-300 flex items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="text-center">
                        <FaPlusCircle size={40} className="text-gray-400 mx-auto mb-2" />
                        <h3 className="font-semibold text-gray-600">Add Inventory</h3>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-base-100 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                <div className="text-center py-10 text-gray-500">
                    No orders yet.
                </div>
            </div>
        </div>
    );
};

export default MedicalStoreDashboard;
