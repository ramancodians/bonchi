
import React from 'react';
import { FaHospital, FaCalendarAlt, FaProcedures } from 'react-icons/fa';

const HospitalDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Hospital / Doctor Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="stats shadow bg-white">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <FaCalendarAlt size={30} />
                        </div>
                        <div className="stat-title">Appointments</div>
                        <div className="stat-value text-primary">0</div>
                        <div className="stat-desc">For today</div>
                    </div>
                </div>

                <div className="stats shadow bg-white">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <FaProcedures size={30} />
                        </div>
                        <div className="stat-title">Available Beds</div>
                        <div className="stat-value text-secondary">--</div>
                        <div className="stat-desc">Update availability</div>
                    </div>
                </div>

                <div className="stats shadow bg-white">
                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <FaHospital size={30} />
                        </div>
                        <div className="stat-title">Total Patients</div>
                        <div className="stat-value text-accent">0</div>
                        <div className="stat-desc">This Month</div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-base-100 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
                <div className="text-center py-10 text-gray-500">
                    No appointments scheduled.
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;
