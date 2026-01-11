import { useEffect, useState } from "react";
import {
  FaCreditCard,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useHealthCard } from "../../hooks/query";
import { activateHealthCardAPI, getPaymentConfigAPI } from "../../hooks/api";
import BonchiCard from "../../components/bonchiCard";

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
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  };

  const handleActivate = async () => {
    if (!razorpayLoaded) {
      toast.error("Payment system loading... Please try again.");
      return;
    }

    setActivating(true);

    try {
      // Get Razorpay key
      const config = await getPaymentConfigAPI();
      const razorpayKey = config?.razorpay_key_id;

      if (!razorpayKey) {
        toast.error("Payment gateway not configured. Contact admin.");
        setActivating(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: 50 * 100, // ₹50 in paise
        currency: "INR",
        name: "Bonchi Cares",
        description: "Health Card Activation Fee",
        // image: '/logo.png', // Ensure this exists or comment out
        handler: async function (response: any) {
          try {
            await activateHealthCardAPI({
              cardId: healthCard.id,
              paymentId: response.razorpay_payment_id,
            });

            toast.success("Health card activated successfully!");
            refetch(); // Refresh card data
          } catch (error: any) {
            toast.error(
              error.response?.data?.message || "Activation failed after payment"
            );
          } finally {
            setActivating(false);
          }
        },
        prefill: {
          name: `${healthCard.first_name} ${healthCard.last_name}`,
          email: healthCard.email,
          contact: healthCard.phone,
        },
        theme: {
          color: "#E87835",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
            setActivating(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error("Payment system error");
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
        <h2 className="text-2xl font-bold text-gray-700">
          Health Card Unavailable
        </h2>
        <p className="text-gray-500 mt-2">
          Could not load your health card. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Health Card</h1>
        <p className="text-gray-600 mt-1">Manage your health card details</p>
      </div>

      <BonchiCard side="back" />

      {/* Activation Section */}
      {healthCard?.status !== "active" && (
        <div className="bg-yellow-400 rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <FaExclamationCircle
              className="text-amber-800 flex-shrink-0"
              size={32}
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                Activate Your Health Card
              </h3>
              <p className="text-gray-800 text-sm">
                Your health card is currently pending activation. Activate it
                now for just ₹50 to access all healthcare services.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <button
                onClick={handleActivate}
                disabled={activating || !razorpayLoaded}
                className="btn btn-primary text-white w-full md:w-auto whitespace-nowrap"
              >
                {!razorpayLoaded
                  ? "Loading..."
                  : activating
                  ? "Processing..."
                  : "Pay ₹50 & Activate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Health Card Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Access to all registered doctors",
              "Easy appointment booking",
              "Digital health records",
              "Emergency services",
              "Operation support eligibility",
              "Family plan options",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <FaCheckCircle
                  className="text-green-500 flex-shrink-0"
                  size={18}
                />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
