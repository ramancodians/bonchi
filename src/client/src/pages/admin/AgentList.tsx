import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader, Search, Eye } from 'lucide-react';
import { getPartnerListAPI } from '../../hooks/api';
import { useDebounce } from 'use-debounce';

const AgentList = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);

    const { data: agentsData, isLoading } = useQuery({
        queryKey: ['admin-agents', page, debouncedSearch],
        queryFn: () => getPartnerListAPI(page, 10, 'BONCHI_MITRA', debouncedSearch),
        keepPreviousData: true
    });

    const agents = agentsData?.items || [];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">All Agents</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search agents..."
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
                                <th>Agent Name</th>
                                <th>Code</th>
                                <th>Contact</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.length > 0 ? (
                                agents.map((agent: any) => (
                                    <tr key={agent.id} className="hover:bg-gray-50">
                                        <td>
                                            <div className="font-bold">
                                                {agent.shop_centre_name || "N/A"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {agent.user?.first_name} {agent.user?.last_name}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                {agent.agent_code || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="text-sm">{agent.user?.mobile}</div>
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                {agent.addresses?.[0]?.district || "N/A"}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${agent.agent_status === 'ACTIVE' ? 'badge-success text-white' : 'badge-ghost'} badge-sm`}>
                                                {agent.agent_status}
                                            </span>
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
                                        No agents found.
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

export default AgentList;
