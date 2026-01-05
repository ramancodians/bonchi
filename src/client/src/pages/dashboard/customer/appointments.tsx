import { Helmet } from "react-helmet";
import { AiOutlineCalendar, AiOutlinePhone } from "react-icons/ai";

const Appointments = () => {
  const phoneNumber = "+91 88773 40862";

  const handleCallToBook = () => {
    // Open phone dialer
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <>
      <Helmet>
        <title>Book Appointment - Bonchi Cares</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center">
          {/* Calendar Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-blue-600 rounded-full p-8 shadow-lg">
              <AiOutlineCalendar size={64} className="text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Book Your Appointment
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            To schedule, reschedule, or check your appointments, please call us
            directly
          </p>

          {/* Call Button */}
          <button
            onClick={handleCallToBook}
            className="btn bg-green-500 hover:bg-green-600 border-none text-white font-semibold px-8 py-4 mb-6 text-lg shadow-md"
          >
            <AiOutlinePhone size={24} className="mr-2" />
            Call Us to Book Appointment
          </button>

          {/* Phone Number */}
          <div className="mt-6">
            <a
              href={`tel:${phoneNumber}`}
              className="text-green-600 text-2xl font-bold hover:text-green-700"
            >
              {phoneNumber}
            </a>
            <p className="text-gray-500 text-sm mt-2">Available 24/7</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointments;
