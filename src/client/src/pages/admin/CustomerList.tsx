import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader, Search, Eye } from 'lucide-react';
import { getCustomerListAPI, searchCustomersAPI } from '../../hooks/api';
import { useDebounce } from 'use-debounce';

const CustomerList = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);

    const { data: customersData, isLoading } = useQuery({
        queryKey: ['admin-customers', page, debouncedSearch],
        queryFn: () => debouncedSearch
            ? searchCustomersAPI(debouncedSearch, page, 10)
            : getCustomerListAPI(page, 10),
        keepPreviousData: true
    });

    const customers = customersData?.items || [];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">All Customers</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name on mobile..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
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
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Location</th>
                                <th>Bonchi Card</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length > 0 ? (
                                customers.map((customer: any) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td>
                                            <div className="font-bold">
                                                {customer.first_name} {customer.last_name}
                                            </div>
                                            <div className="text-xs text-gray-500">{customer.email || "No Email"}</div>
                                        </td>
                                        <td>
                                            <span className="font-mono text-sm">{customer.mobile}</span>
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                {customer.district ? `${customer.district}, ${customer.state}` : "N/A"}
                                            </div>
                                        </td>
                                        <td>
                                            {customer.issued_cards?.length > 0 ? (
                                                <span className="badge badge-success text-white badge-sm">Active</span>
                                            ) : (
                                                <span className="badge badge-ghost badge-sm">No Card</span>
                                            )}
                                        </td>
                                        <td className="text-sm">
                                            {new Date(customer.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50">
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        No customers found.
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

export default CustomerList;
