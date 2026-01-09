import { useState } from 'react';
import { Search, Mail, Phone, MapPin, Users, UserPlus, Settings, DollarSign, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDMAgents } from '../../hooks/query';
import { useDMWalletActionMutation, useDMAgentStatusMutation } from '../../hooks/mutations';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

function DMAgents() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const { data, isLoading } = useDMAgents(page, 10, search);
    const queryClient = useQueryClient();

    // Modal State
    const [selectedAgent, setSelectedAgent] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [action, setAction] = useState('CREDIT');
    const [remarks, setRemarks] = useState('');

    const walletMutation = useDMWalletActionMutation();
    const statusMutation = useDMAgentStatusMutation();

    const agents = data?.agents || [];
    const pagination = data?.pagination || { total: 0, count: 0 };

    const handleManage = (agent: any) => {
        setSelectedAgent(agent);
        setIsModalOpen(true);
        setAmount('');
        setRemarks('');
        setAction('CREDIT');
    };

    const handleWalletSubmit = async (e: any) => {
        e.preventDefault();
        if (!selectedAgent || !amount) return;
        try {
            await walletMutation.mutateAsync({
                agentId: selectedAgent.id,
                amount: parseFloat(amount),
                action,
                remarks
            });
            toast.success(`Wallet ${action === 'CREDIT' ? 'credited' : 'debited'} successfully`);
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['dmAgents'] });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Transaction failed');
        }
    };

    const handleStatusToggle = async () => {
        if (!selectedAgent) return;
        const newStatus = selectedAgent.bonchi_mitra_partner?.agent_status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
        if (!confirm(`Are you sure you want to ${newStatus === 'BLOCKED' ? 'BLOCK' : 'ACTIVATE'} this agent?`)) return;

        try {
            await statusMutation.mutateAsync({
                agentId: selectedAgent.id,
                status: newStatus
            });
            toast.success(`Agent ${newStatus === 'ACTIVE' ? 'activated' : 'blocked'} successfully`);
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['dmAgents'] });
        } catch (error: any) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-8 pb-12 relative">
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
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                                            <p className="text-gray-500">Loading agents...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : agents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-gray-500">
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
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${agent.bonchi_mitra_partner?.agent_status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {agent.bonchi_mitra_partner?.agent_status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => handleManage(agent)}
                                                className="btn btn-sm btn-ghost bg-gray-100 hover:bg-gray-200 text-gray-600"
                                            >
                                                <Settings size={16} />
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Manage Modal */}
                {isModalOpen && selectedAgent && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Manage Agent</h2>
                                    <p className="text-sm text-gray-500">{selectedAgent.first_name} {selectedAgent.last_name} ({selectedAgent.bonchi_mitra_partner?.agent_code})</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Wallet Section */}
                                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-600 font-medium flex items-center gap-2">
                                            <DollarSign size={18} className="text-blue-500" /> Current Balance
                                        </span>
                                        <span className="text-2xl font-bold text-blue-700">
                                            ₹{(parseFloat(selectedAgent.bonchi_mitra_partner?.wallet?.balance || "0")).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    <form onSubmit={handleWalletSubmit} className="space-y-3">
                                        <div className="join w-full">
                                            <select
                                                className="select select-bordered join-item focus:outline-none"
                                                value={action}
                                                onChange={(e) => setAction(e.target.value)}
                                            >
                                                <option value="CREDIT">Add (+)</option>
                                                <option value="DEBIT">Deduct (-)</option>
                                            </select>
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                className="input input-bordered join-item w-full focus:outline-none"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                required
                                                min="1"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Remarks (Admin Note)"
                                            className="input input-bordered w-full"
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className={`btn w-full text-white ${action === 'CREDIT' ? 'btn-primary' : 'btn-error'}`}
                                            disabled={walletMutation.isPending}
                                        >
                                            {walletMutation.isPending ? 'Processing...' : (action === 'CREDIT' ? 'Add Funds' : 'Deduct Funds')}
                                        </button>
                                    </form>
                                </div>

                                {/* Status Section */}
                                <div className="border-t border-gray-100 pt-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">Account Status</h3>
                                            <p className="text-sm text-gray-500">
                                                Currently: <span className={selectedAgent.bonchi_mitra_partner?.agent_status === 'ACTIVE' ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                                    {selectedAgent.bonchi_mitra_partner?.agent_status}
                                                </span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleStatusToggle}
                                            className={`btn ${selectedAgent.bonchi_mitra_partner?.agent_status === 'ACTIVE' ? 'btn-error btn-outline' : 'btn-success text-white'}`}
                                            disabled={statusMutation.isPending}
                                        >
                                            {selectedAgent.bonchi_mitra_partner?.agent_status === 'ACTIVE' ? 'Block Agent' : 'Activate Agent'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DMAgents;
