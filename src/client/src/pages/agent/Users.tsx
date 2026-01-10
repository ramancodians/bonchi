import { useState } from 'react';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAgentUsers } from '../../hooks/query';

function AgentUsers() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const { data, isLoading } = useAgentUsers(page, 10, search);

    const users = data?.users || [];
    const pagination = data?.pagination || { total: 0, pages: 1 };

    // Debounce search ideally, but for now direct value passed to hook (might cause many requests)
    // React Query handles some deduplication but debouncing input is better. 
    // keeping it simple for now, maybe add debounce later.

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Users</h1>
                    <p className="text-gray-600 mt-1">View and manage users you created</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input input-bordered pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">User</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Contact</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Created On</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.first_name} {item.last_name}</p>
                                                <p className="text-sm text-gray-500">ID: {item.user_id?.substring(0, 8)}...</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-800">{item.mobile}</p>
                                            <p className="text-sm text-gray-500">{item.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-600">
                                                {new Date(item.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'activated' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {item.status?.toUpperCase() || "ACTIVE"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                                title="Download Health Card"
                                                onClick={() => {
                                                    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/agent/download-card/${item.user_id}`;
                                                    window.open(url, '_blank');
                                                }}
                                            >
                                                <Download size={18} />
                                                <span className="text-sm">Card</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-medium">{users.length}</span> of <span className="font-medium">{pagination.total}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="flex items-center px-4 rounded-lg border border-gray-300 bg-white">
                                Page {page}
                            </span>
                            <button
                                onClick={() => setPage(p => p + 1)} // Check max page constraint if available
                                disabled={users.length < 10} // Simple check
                                className="p-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AgentUsers;
