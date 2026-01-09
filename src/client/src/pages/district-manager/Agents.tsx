import { useState } from 'react';
import { Search, Mail, Phone, MapPin, Users, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDMAgents } from '../../hooks/query';

function DMAgents() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const { data, isLoading } = useDMAgents(page, 10, search);

    const agents = data?.agents || [];
    const pagination = data?.pagination || { total: 0, count: 0 };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Agents</h1>
                    <p className="text-gray-600 mt-1">Manage agents under your jurisdiction.</p>
                </div>
                <Link
                    to="/district-manager/create-agent"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    <UserPlus size={20} />
                    <span>Create Agent</span>
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between lg:items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Agent</th>
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Contact</th>
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Location</th>
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600 text-right">Wallet Balance</th>
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                                            <p className="text-gray-500">Loading agents...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : agents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                                <Users size={32} className="text-gray-300" />
                                            </div>
                                            <p className="font-medium text-gray-600">No agents found</p>
                                            <p className="text-sm">Agents in your jurisdiction will appear here.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                agents.map((agent: any) => (
                                    <tr key={agent.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm shadow-blue-100">
                                                    {agent.first_name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{agent.first_name} {agent.last_name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded leading-none">Code</span>
                                                        <p className="text-xs font-mono text-gray-500">{agent.bonchi_mitra_partner?.agent_code || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail size={14} className="text-gray-400" />
                                                    {agent.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone size={14} className="text-gray-400" />
                                                    {agent.mobile}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin size={14} className="text-gray-400" />
                                                {agent.district}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-lg font-bold text-green-600">
                                                ₹{(parseFloat(agent.bonchi_mitra_partner?.wallet?.balance || "0")).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${agent.bonchi_mitra_partner?.agent_status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {agent.bonchi_mitra_partner?.agent_status || 'PENDING'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls could be added here similar to other lists */}
            </div>
        </div>
    );
}

export default DMAgents;
