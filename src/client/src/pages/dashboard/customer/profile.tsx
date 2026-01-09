
import React from 'react';
import { useUser } from "../../../hooks/query";

const Profile = () => {
    const { data: user } = useUser();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-16">
                            <span className="text-xl">{user?.first_name?.[0]}</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{user?.first_name} {user?.last_name}</h2>
                        <p className="text-gray-500">{user?.role}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile</label>
                        <p className="mt-1 text-gray-900">{user?.mobile}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
