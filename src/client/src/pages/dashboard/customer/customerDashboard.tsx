import { Helmet } from "react-helmet";
import {
  AiOutlineCalendar,
  AiOutlineGift,
  AiOutlineMedicineBox,
} from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa";
import Logo from "./../../../assets/logo.png";
import { useUser } from "../../../hooks/query";

const CustomerDashboard = () => {
  const { data: userData, isLoading } = useUser();

  const cardNumber = "BON6 0501 7";
  const expiryDate = "Nov 2030";
  const appointmentsCount = 0;
  const additionalMembersCount = 0;

  const handleViewCardDetails = () => {
    console.log("View card details clicked");
  };

  const handleBookAppointment = () => {
    console.log("Book appointment clicked");
  };

  const handleOffers = () => {
    console.log("Offers clicked");
  };

  const handleOneTabAmbulance = () => {
    console.log("One-tap ambulance clicked");
  };

  const handleOperationSupport = () => {
    console.log("Operation support clicked");
  };

  const handleWhatsApp = () => {
    console.log("WhatsApp clicked");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("User Data in Dashboard:", userData);

  return (
    <>
      <Helmet>
        <title>Dashboard - Bonchi Cares</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Greeting */}
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-500 text-xs sm:text-sm mb-1">
              Good Morning
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {userData?.first_name}
            </h1>
          </div>

          {/* Health Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
            <div className="flex items-center mb-4">
              <img src={Logo} alt="Bonchi Cares" className="w-8 h-8 mr-2" />
              <span className="text-white font-semibold">Bonchi Cares</span>
            </div>

            <div className="mb-4">
              <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-wider mb-2">
                {cardNumber}
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-xs">Expires</p>
                  <p className="text-white text-sm font-medium">{expiryDate}</p>
                </div>
                <div className="badge badge-success text-white font-semibold px-3 py-2">
                  ACTIVE
                </div>
              </div>
            </div>

            <button
              onClick={handleViewCardDetails}
              className="btn w-full text-white font-semibold border-none"
              style={{ backgroundColor: "#E87835" }}
            >
              View Card Details
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <button
              onClick={handleBookAppointment}
              className="flex flex-col items-center justify-center bg-white rounded-xl p-2 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full mb-1 sm:mb-2">
                <AiOutlineCalendar
                  size={20}
                  className="text-blue-600 sm:w-6 sm:h-6"
                />
              </div>
              <span className="text-xs sm:text-sm text-gray-700 font-medium text-center">
                Book Appointment
              </span>
            </button>

            <button
              onClick={handleOffers}
              className="flex flex-col items-center justify-center bg-white rounded-xl p-2 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-orange-100 p-2 sm:p-3 rounded-full mb-1 sm:mb-2">
                <AiOutlineGift
                  size={20}
                  className="text-orange-600 sm:w-6 sm:h-6"
                />
              </div>
              <span className="text-xs sm:text-sm text-gray-700 font-medium text-center">
                Offers
              </span>
            </button>

            <button
              onClick={handleOneTabAmbulance}
              className="flex flex-col items-center justify-center bg-white rounded-xl p-2 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mb-1 sm:mb-2">
                <AiOutlineMedicineBox
                  size={20}
                  className="text-red-600 sm:w-6 sm:h-6"
                />
              </div>
              <span className="text-xs sm:text-sm text-gray-700 font-medium text-center">
                One-tap Ambulance
              </span>
            </button>
          </div>

          {/* Loan Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-center shadow-md">
            <p className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide">
              GET INSTANT LOAN APPROVED WITH L&T FINANCE
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
              <p className="text-gray-500 text-xs sm:text-sm mb-1">
                Appointments
              </p>
              <p className="text-blue-600 text-2xl sm:text-3xl font-bold">
                {appointmentsCount}
              </p>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
              <p className="text-gray-500 text-xs sm:text-sm mb-1">
                Additional Members
              </p>
              <p className="text-orange-600 text-2xl sm:text-3xl font-bold">
                {additionalMembersCount}
              </p>
              <p className="text-gray-400 text-xs">(only one)</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <button
              onClick={handleBookAppointment}
              className="btn btn-primary text-white font-semibold btn-sm sm:btn-md"
            >
              <AiOutlineCalendar size={18} className="mr-1 sm:mr-2" />
              <span className="text-xs sm:text-base">Book Appointment</span>
            </button>

            <button
              onClick={handleOperationSupport}
              className="btn text-white font-semibold btn-sm sm:btn-md"
              style={{ backgroundColor: "#7C3AED" }}
            >
              <AiOutlineMedicineBox size={18} className="mr-1 sm:mr-2" />
              <span className="text-xs sm:text-base">Operation Support</span>
            </button>
          </div>
        </div>

        {/* Floating WhatsApp Button */}
        <button
          onClick={handleWhatsApp}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 btn btn-circle btn-md sm:btn-lg bg-green-500 hover:bg-green-600 border-none shadow-lg z-40"
        >
          <FaWhatsapp size={24} className="text-white sm:w-7 sm:h-7" />
        </button>
      </div>
    </>
  );
};

export default CustomerDashboard;
