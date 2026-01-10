import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Loader, Search, Trash2, Plus } from 'lucide-react';
import { getPartnerListAPI, deletePartnerAPI } from '../../hooks/api';

const PartnerList = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();

    const { data: partnersData, isLoading } = useQuery({
        queryKey: ['admin-partners', page, search],
        queryFn: () => getPartnerListAPI(page, 10, undefined, search),
        keepPreviousData: true
    });

    const deleteMutation = useMutation({
        mutationFn: deletePartnerAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
            toast.success("Partner deleted successfully");
        },
        onError: () => toast.error("Failed to delete partner")
    });

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete partner ${name}?`)) {
            deleteMutation.mutate(id);
        }
    };

    const partners = partnersData?.items || [];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">All Partners</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search partners..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Link to="/admin/partners/create" className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none gap-2">
                        <Plus size={20} />
                        Add New Partner
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader className="animate-spin text-blue-600" size={32} />
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                    <table className="table w-full">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th>Partner Name</th>
                                <th>Type</th>
                                <th>Contact</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partners.length > 0 ? (
                                partners.map((user: any) => {
                                    // Determine the partner detail object
                                    const details = user.hospital_partner || user.medical_store || {};
                                    // Address is now inside the nested partner object due to backend change
                                    const address = details.addresses?.[0];

                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td>
                                                <div className="font-bold">
                                                    {details.hospital_name || details.store_name || "N/A"}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {details.contact_person_name || details.owner_name || user.first_name}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge badge-outline">
                                                    {user.role === 'HOSPITAL_PARTNER' ? 'Hospital' : user.role === 'MEDICAL_STORE' ? 'Medical Store' : user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="text-sm">{details.mobile_number || user.mobile}</div>
                                                <div className="text-xs text-gray-400">{details.email || user.email}</div>
                                            </td>
                                            <td>
                                                <div className="text-sm">
                                                    {address?.district || "N/A"}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {address?.state || ""}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge badge-ghost text-xs">Active</span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(user.id, details.hospital_name || details.store_name || "Partner")}
                                                    className="btn btn-ghost btn-xs text-red-500 hover:bg-red-50"
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        No partners found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PartnerList;
