
import React from 'react';
import { FaUserMd, FaCalendarCheck, FaHandHoldingHeart } from 'react-icons/fa';

const HealthAssistantDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Health Assistant Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="stats shadow bg-white">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <FaUserMd size={30} />
                        </div>
                        <div className="stat-title">Assigned Patients</div>
                        <div className="stat-value text-primary">0</div>
                        <div className="stat-desc">Active cases</div>
                    </div>
                </div>

                <div className="stats shadow bg-white">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <FaCalendarCheck size={30} />
                        </div>
                        <div className="stat-title">Tasks Today</div>
                        <div className="stat-value text-secondary">0</div>
                        <div className="stat-desc">0 completed</div>
                    </div>
                </div>

                <div className="stats shadow bg-white">
                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <FaHandHoldingHeart size={30} />
                        </div>
                        <div className="stat-title">Services Given</div>
                        <div className="stat-value text-accent">0</div>
                        <div className="stat-desc">This month</div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-base-100 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>
                <div className="text-center py-10 text-gray-500">
                    No scheduled tasks or visits for today.
                </div>
            </div>
        </div>
    );
};

export default HealthAssistantDashboard;
