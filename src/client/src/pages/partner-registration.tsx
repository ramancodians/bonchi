import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Logo from "./../assets/logo.png";
import loginBackground from "../assets/login-background.png";
import { FaUserMd, FaHospital, FaPills } from "react-icons/fa";
import { useState } from "react";
import BonchiMitraPartnerForm from "../components/partner-forms/bonch-mitra-partner";
import HospitalPartnerForm from "../components/partner-forms/hospital-partner";
import MedicalStoreForm from "../components/partner-forms/medical-partner";

const PARTNER_TYPES = [
  {
    label: "Bonchi Mitra",
    hint: "For small clinics and individual practitioners",
    value: "BONCHI_MITRA",
    icon: <FaUserMd />,
  },
  {
    label: "Hospital Partner",
    hint: "For hospitals and larger healthcare facilities",
    value: "HOSPITAL_PARTNER",
    icon: <FaHospital />,
  },
  {
    label: "Medical Store",
    hint: "For pharmacies and medical supply stores",
    value: "MEDICAL_STORE",
    icon: <FaPills />,
  },
];

const PartnerRegistration = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const renderForm = () => {
    switch (selectedType) {
      case "BONCHI_MITRA":
        return <BonchiMitraPartnerForm />;
      case "HOSPITAL_PARTNER":
        return <HospitalPartnerForm />;
      case "MEDICAL_STORE":
        return <MedicalStoreForm />;
      default:
        return (
          <p className="text-gray-400">Please select a partner type above</p>
        );
    }
  };

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
              <div className="flex flex-col md:flex-row gap-2">
                {PARTNER_TYPES.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`border rounded-xl p-3 flex cursor-pointer transition-all ${
                      selectedType === type.value
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex justify-center items-center w-10 md:w-12 text-xl md:text-2xl ${
                        selectedType === type.value
                          ? "text-blue-700"
                          : "text-blue-600"
                      }`}
                    >
                      {type.icon}
                    </div>
                    <div className="flex-1 ml-2">
                      <p
                        className={`font-medium text-sm md:text-base ${
                          selectedType === type.value
                            ? "text-blue-700"
                            : "text-gray-800"
                        }`}
                      >
                        {type.label}
                      </p>
                      <p className="text-xs text-gray-600">{type.hint}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Container */}
              <div className="mt-6">{renderForm()}</div>

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
