import { useState } from 'react';
import { Wallet, ArrowUp, ArrowDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAgentWallet } from '../../hooks/query';

function AgentWallet() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useAgentWallet(page);

    const wallet = data?.wallet || { balance: '0', total_earned: '0', total_spent: '0' };
    const transactions = data?.transactions || [];
    const pagination = data?.pagination || { total: 0, pages: 1 };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Wallet & Transactions</h1>
                <p className="text-gray-600 mt-1">Track your earnings and spendings</p>
            </div>

            {/* Balance Card */}
            <div className="card bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Available Balance</p>
                        <p className="text-4xl font-bold">₹{Number(wallet.balance).toFixed(2)}</p>
                    </div>

                    <div className="flex gap-8">
                        <div>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                                <ArrowDown className="text-green-400" size={16} /> Total Earned
                            </p>
                            <p className="text-xl font-semibold mt-1">₹{Number(wallet.total_earned).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                                <ArrowUp className="text-red-400" size={16} /> Total Spent
                            </p>
                            <p className="text-xl font-semibold mt-1">₹{Number(wallet.total_spent).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : transactions.length > 0 ? (
                        transactions.map((t: any) => (
                            <div key={t.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${t.transaction_type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                                        {t.transaction_type === 'credit' ? (
                                            <ArrowDown className="text-green-600" size={20} /> // Credit comes IN
                                        ) : (
                                            <ArrowUp className="text-red-600" size={20} /> // Debit goes OUT
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{t.description}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(t.created_at).toLocaleDateString()} • {new Date(t.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${t.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.transaction_type === 'credit' ? '+' : '-'}₹{Number(t.amount).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-400">Bal: ₹{Number(t.balance_after).toFixed(2)}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No transactions found
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {transactions.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded hover:bg-white disabled:opacity-50"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm text-gray-600">Page {page}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={transactions.length < 20} // Simple check
                            className="p-2 rounded hover:bg-white disabled:opacity-50"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AgentWallet;
