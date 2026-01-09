import React from "react";
import { Helmet } from "react-helmet";
import {
  AiOutlineCalendar,
  AiOutlineGift,
  AiOutlineMedicineBox,
} from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa";
import Logo from "./../../../assets/logo.png";
import { useUser, useHealthCard, useBanners } from "../../../hooks/query";

const CustomerDashboard = () => {
  const { data: userData, isLoading } = useUser();


  /* Health Card Logic */
  const { data: healthCard, isLoading: isCardLoading } = useHealthCard();
  const { data: banners } = useBanners();
  const [currentBannerIndex, setCurrentBannerIndex] = React.useState(0);

  React.useEffect(() => {
    if (banners && banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // 5 seconds
      return () => clearInterval(interval);
    }
  }, [banners]);

  const cardNumber = healthCard?.card_number || "PENDING";
  const expiryDate = healthCard?.expiry_date ? new Date(healthCard.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : "--";
  const status = healthCard?.status || "PENDING";

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

          {/* Banner Slider */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg mb-4 sm:mb-6 min-h-[220px]">
            {/* Slider Background */}
            <div className="absolute inset-0 z-0 bg-gray-200 transition-all duration-1000">
              {banners && banners.length > 0 ? (
                banners.map((banner: any, index: number) => (
                  <div
                    key={banner.id}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentBannerIndex ? 'opacity-100' : 'opacity-0'}`}
                    style={{ backgroundImage: `url(${banner.url})` }}
                  />
                ))
              ) : (
                // Placeholder if no banners
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                  <span className="text-sm">Bonchi Cares</span>
                </div>
              )}
            </div>
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
