import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Logo from "./../assets/logo.png";
import loginBackground from "../assets/login-background.png";

const PARTNER_TYPES = [
  {
    label: "Bonchi Mitra",
    hint: "For small clinics and individual practitioners",
    value: "BONCHI_MITRA",
  },
  {
    label: "Hospital Partner",
    hint: "For hospitals and larger healthcare facilities",
    value: "HOSPITAL_PARTNER",
  },
];

type PartnerForm = {};

const PartnerRegistration = () => {
  return (
    <>
      <Helmet>
        <title>Partner Registration - Bonchi Cares</title>
      </Helmet>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8"
        style={{ backgroundImage: `url(${loginBackground})` }}
      >
        <div className="w-full max-w-2xl">
          <div className="card bg-white shadow-2xl">
            <div className="card-body p-8">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <img src={Logo} alt="Bonchi Cares Logo" className="w-16 h-16" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
                Bonchi Cares
              </h2>
              <h3 className="text-xl font-semibold text-center text-gray-700 mb-1">
                Partner Registration
              </h3>
              <p className="text-center text-gray-500 text-sm mb-6">
                Register your clinic/hospital with us
              </p>

              {/* Form will go here */}
              <div className="min-h-[300px] flex items-center justify-center">
                <p className="text-gray-400">Form content will be added here</p>
              </div>

              {/* Sign In Link */}
              <div className="text-center mt-6">
                <span className="text-gray-600 text-sm">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerRegistration;
