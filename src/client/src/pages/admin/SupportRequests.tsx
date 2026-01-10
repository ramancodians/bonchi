
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

    const [selectedRequest, setSelectedRequest] = React.useState<any>(null);

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
                                        <button
                                            onClick={() => setSelectedRequest(req)}
                                            className="btn btn-xs btn-ghost text-blue-600"
                                        >
                                            View
                                        </button>
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

            {/* View Details Modal */}
            {selectedRequest && (
                <dialog id="details_modal" className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-3xl">
                        <h3 className="font-bold text-lg mb-4">Request Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Patient Info */}
                            <div>
                                <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Patient Details</h4>
                                <p><span className="text-gray-500 text-sm">Name:</span> {selectedRequest.patient_name}</p>
                                <p><span className="text-gray-500 text-sm">Age/Gender:</span> {selectedRequest.age} / {selectedRequest.gender}</p>
                                <p><span className="text-gray-500 text-sm">Mobile:</span> {selectedRequest.user?.mobile || "N/A"}</p>
                                <p><span className="text-gray-500 text-sm">Relation:</span> {selectedRequest.relationship || "N/A"}</p>
                            </div>

                            {/* Address */}
                            <div>
                                <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Address</h4>
                                <p><span className="text-gray-500 text-sm">Village:</span> {selectedRequest.address_village || "N/A"}</p>
                                <p><span className="text-gray-500 text-sm">Block:</span> {selectedRequest.address_block || "N/A"}</p>
                                <p><span className="text-gray-500 text-sm">District:</span> {selectedRequest.address_district || "N/A"}</p>
                                <p><span className="text-gray-500 text-sm">State:</span> {selectedRequest.address_state || "N/A"}</p>
                            </div>

                            {/* Medical Info */}
                            <div>
                                <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Medical Details</h4>
                                <p><span className="text-gray-500 text-sm">Hospital:</span> {selectedRequest.hospital_name || "N/A"}</p>
                                <p><span className="text-gray-500 text-sm">Doctor:</span> {selectedRequest.doctor_name || "N/A"}</p>
                                <p><span className="text-gray-500 text-sm">Surgery:</span> {selectedRequest.type_of_surgery || "N/A"}</p>
                                <p><span className="text-gray-500 text-sm">Est Cost:</span> ₹{selectedRequest.estimated_cost || "N/A"}</p>
                                {selectedRequest.file_url && (
                                    <div className="mt-2">
                                        <a
                                            href={selectedRequest.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-xs btn-outline btn-primary"
                                        >
                                            View Uploaded Document
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Financial & Emergency */}
                            <div>
                                <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Financial & Emergency</h4>
                                <p><span className="text-gray-500 text-sm">Income:</span> ₹{selectedRequest.monthly_income || "N/A"}</p>
                                <p><span className="text-gray-500 text-sm">Ayushman:</span> {selectedRequest.has_insurance ? "Yes" : "No"}</p>
                                <p><span className="text-gray-500 text-sm">Prev Assist:</span> {selectedRequest.previous_assistance ? "Yes" : "No"}</p>
                                <p><span className="text-gray-500 text-sm">NGO Support:</span> {selectedRequest.ngo_support ? "Yes" : "No"}</p>
                                <div className="mt-2 p-2 bg-gray-50 rounded">
                                    <p className="text-sm font-medium">Guardian Contact</p>
                                    <p className="text-xs">{selectedRequest.guardian_name || "N/A"} ({selectedRequest.guardian_relation})</p>
                                    <p className="text-xs">{selectedRequest.guardian_number || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button className="btn" onClick={() => setSelectedRequest(null)}>Close</button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default AdminSupportRequests;
