
import { useEffect, useState } from 'react';
import { FaCreditCard, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useHealthCard } from '../../hooks/query';
import { activateHealthCardAPI, getPaymentConfigAPI } from '../../hooks/api';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function HealthCard() {
    const { data: healthCard, isLoading, refetch } = useHealthCard();
    const [activating, setActivating] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    useEffect(() => {
        loadRazorpay();
    }, []);

    const loadRazorpay = () => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);
    };

    const handleActivate = async () => {
        if (!razorpayLoaded) {
            toast.error('Payment system loading... Please try again.');
            return;
        }

        setActivating(true);

        try {
            // Get Razorpay key
            const config = await getPaymentConfigAPI();
            const razorpayKey = config?.razorpay_key_id;

            if (!razorpayKey) {
                toast.error('Payment gateway not configured. Contact admin.');
                setActivating(false);
                return;
            }

            const options = {
                key: razorpayKey,
                amount: 50 * 100, // ₹50 in paise
                currency: 'INR',
                name: 'Bonchi Cares',
                description: 'Health Card Activation Fee',
                // image: '/logo.png', // Ensure this exists or comment out
                handler: async function (response: any) {
                    try {
                        await activateHealthCardAPI({
                            cardId: healthCard.id,
                            paymentId: response.razorpay_payment_id
                        });

                        toast.success('Health card activated successfully!');
                        refetch(); // Refresh card data
                    } catch (error: any) {
                        toast.error(error.response?.data?.message || 'Activation failed after payment');
                    } finally {
                        setActivating(false);
                    }
                },
                prefill: {
                    name: `${healthCard.first_name} ${healthCard.last_name}`,
                    email: healthCard.email,
                    contact: healthCard.phone
                },
                theme: {
                    color: '#E87835'
                },
                modal: {
                    ondismiss: function () {
                        toast.error('Payment cancelled');
                        setActivating(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error: any) {
            console.error('Payment error:', error);
            toast.error('Payment system error');
            setActivating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }

    if (!healthCard) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-700">Health Card Unavailable</h2>
                <p className="text-gray-500 mt-2">Could not load your health card. Please contact support.</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Health Card</h1>
                <p className="text-gray-600 mt-1">Manage your health card details</p>
            </div>

            {/* Health Card Display */}
            <div className="relative">
                <div className="card bg-gradient-to-br from-blue-600 to-orange-500 text-white p-8 relative overflow-hidden shadow-xl rounded-2xl">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-white/80 text-sm mb-1">Bonchi Card</p>
                                <p className="text-2xl font-bold">Health Card</p>
                            </div>
                            {/* <img src="/logo.png" alt="Bonchi Cares" className="w-12 h-12 object-contain opacity-80" /> */}
                        </div>

                        <div className="mb-8">
                            <p className="text-white/80 text-sm mb-1">Card Number</p>
                            <p className="text-2xl font-mono tracking-wider">{healthCard?.card_number || "XXXX-XXXX-XXXX"}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-white/80 text-sm mb-1">Cardholder Name</p>
                                <p className="font-semibold text-lg">{healthCard?.first_name} {healthCard?.last_name}</p>
                            </div>
                            <div>
                                <p className="text-white/80 text-sm mb-1">Status</p>
                                <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                                    {healthCard?.status === 'active' ? (
                                        <>
                                            <FaCheckCircle size={16} className="text-green-300" />
                                            <span className="font-semibold text-sm">Active</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaExclamationCircle size={16} className="text-yellow-300" />
                                            <span className="font-semibold text-sm">Pending</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Details */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Card Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Email</p>
                            <p className="font-semibold text-gray-800">{healthCard?.email || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Phone</p>
                            <p className="font-semibold text-gray-800">{healthCard?.phone || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Created Date</p>
                            <p className="font-semibold text-gray-800">
                                {healthCard?.created_at ? new Date(healthCard.created_at).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                        {healthCard?.activation_date && (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Activation Date</p>
                                <p className="font-semibold text-gray-800">
                                    {new Date(healthCard.activation_date).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Activation Section */}
            {healthCard?.status !== 'active' && (
                <div className="alert alert-warning shadow-lg">
                    <FaExclamationCircle className="text-yellow-700" size={24} />
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-800">Activate Your Health Card</h3>
                        <p className="text-gray-700 text-sm">
                            Your health card is currently pending activation. Activate it now for just ₹50 to access all healthcare services.
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={handleActivate}
                            disabled={activating || !razorpayLoaded}
                            className="btn btn-primary text-white"
                        >
                            {!razorpayLoaded ? 'Loading...' : activating ? 'Processing...' : 'Pay ₹50 & Activate'}
                        </button>
                    </div>
                </div>
            )}

            {/* Benefits */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Health Card Benefits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Access to all registered doctors',
                            'Easy appointment booking',
                            'Digital health records',
                            'Emergency services',
                            'Operation support eligibility',
                            'Family plan options',
                        ].map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <FaCheckCircle className="text-green-500 flex-shrink-0" size={18} />
                                <span className="text-gray-700">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
