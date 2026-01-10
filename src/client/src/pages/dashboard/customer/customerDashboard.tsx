import React from "react";
import { Helmet } from "react-helmet";
import {
  FaHospital,
  FaMicroscope,
  FaCalendarAlt,
  FaAmbulance,
  FaPhoneAlt,
  FaTint,
  FaFileMedical,
  FaHandHoldingMedical,
} from "react-icons/fa";
import { MdLocalPharmacy, MdEmergency } from "react-icons/md";
import { useUser, useBanners } from "../../../hooks/query";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const { data: userData, isLoading } = useUser();
  const { data: banners } = useBanners();
  const [currentBannerIndex, setCurrentBannerIndex] = React.useState(0);
  const navigate = useNavigate();

  const SUPPORT_PHONE = "9770808605"; // Placeholder, update if found

  React.useEffect(() => {
    if (banners && banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const handleBloodClick = () => {
    alert(
      `Service not available in your area.\nFor more detail contact below: ${SUPPORT_PHONE}`
    );
  };

  const handleCallSupport = () => {
    window.location.href = `tel:${SUPPORT_PHONE}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Bonchi Cares</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pb-24">
        {" "}
        {/* Added padding bottom for fixed footer */}
        {/* Header */}
        <div className="bg-white p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Good Morning</p>
          <h1 className="text-2xl font-bold text-gray-800">
            {userData?.first_name || "User"}
          </h1>
        </div>
        <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
          {/* Banner Slider */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg h-40 sm:h-52 bg-white">
            <div className="absolute inset-0 flex items-center justify-center">
              {banners && banners.length > 0 ? (
                banners.map((banner: any, index: number) => (
                  <div
                    key={banner.id}
                    className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-1000 ${
                      index === currentBannerIndex ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ backgroundImage: `url(${banner.url})` }}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">
                  <span className="text-xl font-bold text-primary opacity-50">
                    Bonchi Cares
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Main Grid Services */}
          <div className="grid grid-cols-3 gap-4">
            {/* Row 1 */}
            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => navigate("/hospitals")}
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                <FaHospital className="text-red-500 text-2xl" />
              </div>
              <span className="text-xs font-medium text-gray-700">
                Hospital
              </span>
            </div>

            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => navigate("/labs")}
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                <FaMicroscope className="text-blue-500 text-2xl" />
              </div>
              <span className="text-xs font-medium text-gray-700">Labs</span>
            </div>

            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => navigate("/medical-stores")}
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                <MdLocalPharmacy className="text-green-500 text-3xl" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700">
                Medical Store
              </span>
            </div>

            {/* Row 2 */}
            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => navigate("/dashboard/appointments")}
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                <FaCalendarAlt className="text-blue-600 text-2xl" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700">
                Book Appointment
              </span>
            </div>

            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => handleCallSupport()}
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                <MdEmergency className="text-red-600 text-3xl" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700">
                24x7 Emergency
              </span>
            </div>

            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => handleCallSupport()}
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                <FaAmbulance className="text-teal-600 text-2xl" />
              </div>
              <span className="text-xs font-medium text-center text-gray-700">
                Ambulance (One Tap)
              </span>
            </div>
          </div>

          {/* Quick Actions Support */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Quick Actions Support
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div
                className="flex flex-col items-center gap-2 cursor-pointer"
                onClick={handleBloodClick}
              >
                <div className="w-16 h-16 bg-red-50 rounded-2xl shadow-sm flex items-center justify-center border border-red-100">
                  <FaTint className="text-red-600 text-2xl" />
                </div>
                <span className="text-xs font-medium text-gray-700">Blood</span>
              </div>

              <div
                className="flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => navigate("/dashboard/support")}
              >
                <div className="w-16 h-16 bg-orange-50 rounded-2xl shadow-sm flex items-center justify-center border border-orange-100">
                  <FaFileMedical className="text-orange-600 text-2xl" />
                </div>
                <span className="text-xs font-medium text-center text-gray-700">
                  Operation Assistance
                </span>
              </div>

              <div
                className="flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => navigate("/dashboard/surgery-support")}
              >
                <div className="w-16 h-16 bg-yellow-50 rounded-2xl shadow-sm flex items-center justify-center border border-yellow-100">
                  <FaHandHoldingMedical className="text-yellow-700 text-2xl" />
                </div>
                <span className="text-xs font-medium text-center text-gray-700">
                  Surgery Financial Support
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Fixed Bottom Action Buttons */}
      </div>

      {/* Removed Fixed Bottom Action Buttons to prevent overlap with Navigation */}
    </>
  );
};

export default CustomerDashboard;
