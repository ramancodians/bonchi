
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getSupportListAPI, updateSupportAPI } from '../../hooks/api';

const AdminSupportRequests = () => {
    const queryClient = useQueryClient();
    const { data: requests, isLoading } = useQuery({
        queryKey: ['admin-support-requests'],
        queryFn: getSupportListAPI
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) =>
            updateSupportAPI(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-support-requests'] });
            toast.success("Request status updated");
        },
        onError: () => toast.error("Failed to update status")
    });

    const handleUpdateStatus = (id: string, status: string) => {
        if (window.confirm(`Are you sure you want to mark this as ${status}?`)) {
            updateMutation.mutate({ id, status });
        }
    };

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
                                    <div className={`badge ${req.status === 'APPROVED' ? 'badge-success text-white' :
                                        req.status === 'REJECTED' ? 'badge-error text-white' :
                                            'badge-warning'
                                        }`}>
                                        {req.status || 'PENDING'}
                                    </div>
                                </td>
                                <td className="text-sm">
                                    {new Date(req.created_at || Date.now()).toLocaleDateString()}
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        {req.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                                                    className="btn btn-xs btn-success text-white"
                                                    disabled={updateMutation.isPending}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                                                    className="btn btn-xs btn-error text-white"
                                                    disabled={updateMutation.isPending}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button className="btn btn-xs btn-ghost text-blue-600">View</button>
                                    </div>
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
