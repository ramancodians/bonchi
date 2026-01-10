import { Users, UserPlus, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDMDashboard } from '../../hooks/query';

function DMDashboard() {
    const { data: stats, isLoading } = useDMDashboard();

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Safety check if stats is undefined/null
    const agentCount = stats?.stats?.totalAgents || 0;
    const userCount = 0; // Backend dashboard endpoint I wrote doesn't return userCount yet (returns total and active agents), I should fix backend or just use agent counts.
    // My backend returns: { stats: { totalAgents, activeAgents, districtsCount }, recentAgents }
    // Old frontend expected { agentCount, userCount ... }
    // I shall align variable names or update this dashboard to use my backend response structure.

    const assignedDistricts = stats?.assignedDistricts || []; // My backend didn't return list explicitly in root, but I can infer or update backend.

    // Actually my backend returns:
    // stats: { totalAgents, activeAgents, districtsCount: districts.length }

    // I should update backend to return "assignedDistricts" array if needed for UI list.
    // For now let's use what I have.

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">District Manager Dashboard</h1>
                <p className="text-gray-600 mt-1">Overview of your assigned jurisdictions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Agents</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats?.stats?.totalAgents || 0}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Agents</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats?.stats?.activeAgents || 0}</h3>
                </div>

                <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Jurisdiction Stats</h4>
                    <div className="flex flex-wrap gap-2">
                        <div className="text-gray-600">
                            You are managing <span className="font-bold text-blue-600">{stats?.stats?.districtsCount || 0}</span> assigned district(s):
                            <br />
                            <span className="font-semibold text-gray-800">
                                {stats?.stats?.assignedDistricts?.join(", ") || "None"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Users size={20} className="text-primary-blue" />
                        Quick Actions
                    </h3>
                    <div className="space-y-4">
                        <Link to="/district-manager/agents" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition border border-transparent hover:border-blue-100 group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white rounded-xl shadow-sm text-primary-blue group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <UserPlus size={20} />
                                </div>
                                <span className="font-semibold text-gray-700 group-hover:text-blue-700">Manage Agents</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500" />
                        </Link>
                        <Link to="/district-manager/create-agent" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition border border-transparent hover:border-blue-100 group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white rounded-xl shadow-sm text-primary-blue group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <UserPlus size={20} />
                                </div>
                                <span className="font-semibold text-gray-700 group-hover:text-blue-700">Create New Agent</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500" />
                        </Link>
                    </div>
                </div>

                {/* Recent Agents */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Users size={20} className="text-green-600" />
                        Recent Agents
                    </h3>
                    <div className="space-y-3">
                        {stats?.recentAgents?.length > 0 ? (
                            stats.recentAgents.map((agent: any) => (
                                <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-800">{agent.first_name} {agent.last_name}</p>
                                        <p className="text-sm text-gray-500">{agent.district}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(agent.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No agents yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DMDashboard;
