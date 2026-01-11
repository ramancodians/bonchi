import { Link } from "react-router-dom";

const AddCard = () => {
  const benefits = [
    {
      title: "Doctor Consultations",
      discount: "Up to 40% OFF",
    },
    {
      title: "Medicine",
      discount: "10-20% OFF",
    },
    {
      title: "Hospital & Surgery",
      discount: "30-75% OFF",
    },
    {
      title: "24×7 Ambulance",
      discount: "Available",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 bg-gradient-to-br from-yellow-200 via-amber-200 to-yellow-300 rounded-3xl shadow-xl">
      <div className="text-center max-w-md w-full">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Get Your Bonchi Healthcard
          </h2>
          <p className="text-base text-gray-700 font-medium">
            Ab Ilaaj Karaana Hua Aasaan
          </p>
        </div>

        {/* Benefits List */}
        <div className="space-y-3 mb-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 p-4 rounded-xl border border-white/40"
            >
              <span className="font-semibold text-gray-800">
                {benefit.title}
              </span>
              <span className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full text-sm shadow-md">
                {benefit.discount}
              </span>
            </div>
          ))}
        </div>

        {/* Card Info */}
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl mb-6 text-sm shadow-md border border-white/40">
          <p className="font-bold text-gray-900 text-base">5 Year Validity</p>
          <p className="text-gray-700 font-medium">
            100% Transparent • No Hidden Fees
          </p>
        </div>

        {/* CTA Button */}
        <Link
          to="/dashboard/health-card"
          className="block w-full text-center py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          Get Your Card Now
        </Link>

        {/* Additional Info */}
        <p className="text-sm text-gray-700 mt-4 font-medium">
          Join thousands of families enjoying affordable healthcare
        </p>
      </div>
    </div>
  );
};

export default AddCard;
