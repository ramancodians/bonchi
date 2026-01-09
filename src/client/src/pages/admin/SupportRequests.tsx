
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSupportListAPI } from '../../hooks/api';

const AdminSupportRequests = () => {
    const { data: requests, isLoading } = useQuery({
        queryKey: ['admin-support-requests'],
        queryFn: getSupportListAPI
    });

    if (isLoading) return <div className="p-8 text-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Operation Support Requests</h1>

            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                <table className="table">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600">
                            <th>Patient Name</th>
                            <th>Contact (User)</th>
                            <th>Condition</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests?.map((req: any) => (
                            <tr key={req.id}>
                                <td>
                                    <div className="font-bold">{req.patient_name}</div>
                                    <div className="text-xs text-gray-500">{req.age} Y / {req.gender}</div>
                                </td>
                                <td>
                                    <div className="font-medium">{req.user?.first_name} {req.user?.last_name}</div>
                                    <div className="text-xs text-gray-500">{req.user?.mobile}</div>
                                </td>
                                <td>
                                    <div className="font-medium">{req.type_of_surgery || "Not Specified"}</div>
                                    <div className="text-xs text-gray-500">{req.hospital_name || "Hospital Needed"}</div>
                                </td>
                                <td>
                                    {/* Assuming status field exists, else default */}
                                    <span className="badge badge-warning">Pending</span>
                                </td>
                                <td className="text-sm">
                                    {new Date(req.created_at || Date.now()).toLocaleDateString()}
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-ghost text-blue-600">View Details</button>
                                </td>
                            </tr>
                        ))}
                        {(!requests || requests.length === 0) && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                    No support requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSupportRequests;
