
import React from 'react';

const HealthAssistantSchedule = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Schedule</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold">Today's Visits</h2>
                    <span className="text-sm text-gray-400">{new Date().toDateString()}</span>
                </div>
                <p className="text-gray-500 text-center py-8">No visits scheduled for today.</p>
            </div>
        </div>
    );
};

export default HealthAssistantSchedule;
