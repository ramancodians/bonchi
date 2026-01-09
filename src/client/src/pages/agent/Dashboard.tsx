import { Wallet, Users, UserPlus, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { useAgentDashboard } from '../../hooks/query';
import { Link } from 'react-router-dom';

function AgentDashboard() {
    const { data: stats, isLoading } = useAgentDashboard();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            </div>
        );
    }

    const walletBalance = Number(stats?.wallet?.balance) || 0;
    // stats?.wallet?.total_earned (could be undefined if not in API response fallback)
    const totalEarned = Number(stats?.wallet?.total_earned) || 0;
    const totalSpent = Number(stats?.wallet?.total_spent) || 0;
    const totalUsers = Number(stats?.stats?.totalUsers) || 0;
    const usersThisMonth = Number(stats?.stats?.usersThisMonth) || 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Agent Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your users and wallet</p>
            </div>

            {/* Wallet Balance Card */}
            <div className="card bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Wallet Balance</p>
                        <p className="text-4xl font-bold">₹{walletBalance.toFixed(2)}</p>
                        <p className="text-blue-100 text-sm mt-2">
                            Available for creating new users
                        </p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-xl">
                        <Wallet size={40} />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Users Created</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{totalUsers}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <Users className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Users This Month</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{usersThisMonth}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl">
                            <TrendingUp className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Spent</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">₹{totalSpent.toFixed(2)}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-xl">
                            <ArrowDown className="text-red-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/agent/create-user" className="btn btn-primary text-center flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
                        <UserPlus size={20} />
                        Create New User
                    </Link>
                    <Link to="/agent/users" className="btn btn-secondary text-center flex items-center justify-center gap-2 bg-gray-100 text-gray-800 p-3 rounded-lg hover:bg-gray-200 transition">
                        <Users size={20} />
                        View My Users
                    </Link>
                    <Link to="/agent/wallet" className="btn btn-secondary text-center flex items-center justify-center gap-2 bg-gray-100 text-gray-800 p-3 rounded-lg hover:bg-gray-200 transition">
                        <Wallet size={20} />
                        Wallet & Transactions
                    </Link>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
                {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                    <div className="space-y-3">
                        {stats.recentTransactions.map((transaction: any) => (
                            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${transaction.transaction_type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                        {transaction.transaction_type === 'credit' ? (
                                            <ArrowUp className="text-green-600" size={20} />
                                        ) : (
                                            <ArrowDown className="text-red-600" size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{transaction.description}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(transaction.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className={`text-lg font-bold ${transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {transaction.transaction_type === 'credit' ? '+' : '-'}₹{transaction.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No transactions yet</p>
                )}
            </div>

            {/* Info Box */}
            <div className="card bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                <div className="flex gap-3">
                    <div className="text-blue-600 mt-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-blue-900 mb-1">How it works</p>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Create new user accounts for your clients</li>
                            <li>• ₹100 will be deducted from your wallet per user for card activation (Default)</li>
                            <li>• Users get activated health cards immediately after creation</li>
                            <li>• You can download the health card from "My Users" section</li>
                            <li>• Contact admin to add money to your wallet when balance is low</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AgentDashboard;
