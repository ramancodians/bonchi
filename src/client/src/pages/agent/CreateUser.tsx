import { useState } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreateAgentUserMutation } from '../../hooks/mutations';
import { toast } from 'react-toastify';

function CreateUser() {
    const navigate = useNavigate();
    const createMutation = useCreateAgentUserMutation();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        district: '',
        state: '',
        pincode: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            mobile: formData.phone,
            password: formData.password,
            // Map address fields
            full_address: formData.address, // Backend might not strict check this but good to have
            district: formData.district,
            state: formData.state,
            pincode: formData.pincode
        };

        createMutation.mutate(payload, {
            onSuccess: (data) => {
                toast.success(`User created! Remaining Balance: ₹${data.remainingBalance}`);
                // Reset form
                setFormData({
                    firstName: '', lastName: '', email: '', phone: '', password: '',
                    address: '', district: '', state: '', pincode: ''
                });
                setTimeout(() => navigate('/agent/users'), 2000);
            },
            onError: (error: any) => {
                const msg = error.response?.data?.message || 'Failed to create user';
                toast.error(msg);
            }
        });
    };

    const loading = createMutation.isPending;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Create New User</h1>
                <p className="text-gray-600 mt-1">Add a new user account and health card</p>
            </div>

            {/* Info Box */}
            <div className="card bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                <div className="flex gap-3">
                    <div className="text-blue-600 mt-1">
                        <UserPlus size={24} />
                    </div>
                    <div>
                        <p className="font-semibold text-blue-900 mb-1">Wallet Deduction</p>
                        <p className="text-sm text-blue-800">
                            ₹100 will be deducted from your wallet for card activation
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="label block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="input input-bordered w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="label block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="input input-bordered w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="input input-bordered w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="label block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="input input-bordered w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            maxLength={10}
                        />
                    </div>

                    <div>
                        <label className="label block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="input input-bordered w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            minLength={6}
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="label block text-sm font-medium text-gray-700 mb-1">State *</label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                className="input input-bordered w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="label block text-sm font-medium text-gray-700 mb-1">District *</label>
                            <input
                                type="text"
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                className="input input-bordered w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="label block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                            <input
                                type="text"
                                value={formData.pincode}
                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                className="input input-bordered w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label block text-sm font-medium text-gray-700 mb-1">Address (Full)</label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="textarea textarea-bordered w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            <UserPlus size={20} />
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/agent/users')}
                            className="btn btn-secondary bg-gray-100 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateUser;
