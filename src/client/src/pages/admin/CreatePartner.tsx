import React, { useState } from 'react';
import DistrictCoordinatorForm from "../../components/partner-forms/district-coordinator-partner";
import HealthAssistantForm from "../../components/partner-forms/health-assistant-partner";
import { FaUserMd, FaHospital, FaPills, FaUserTie, FaStethoscope } from "react-icons/fa";

import BonchiMitraPartnerForm from "../../components/partner-forms/bonch-mitra-partner";
import HospitalPartnerForm from "../../components/partner-forms/hospital-partner";
import MedicalStoreForm from "../../components/partner-forms/medical-partner";

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
    {
        label: "Health Assistant",
        hint: "For nurses, compounders, and health workers",
        value: "HEALTH_ASSISTANT",
        icon: <FaStethoscope />,
    },
    {
        label: "District Coordinator", // aka District Manager
        hint: "For managing operations in a district",
        value: "DISTRICT_CORDINATOR",
        icon: <FaUserTie />,
    },
];

const CreatePartner = () => {
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const renderForm = () => {
        switch (selectedType) {
            case "BONCHI_MITRA":
                return <BonchiMitraPartnerForm />;
            case "HOSPITAL_PARTNER":
                return <HospitalPartnerForm isCompact={false} />;
            case "MEDICAL_STORE":
                return <MedicalStoreForm isCompact={false} />;
            case "HEALTH_ASSISTANT":
                return <HealthAssistantForm />;
            case "DISTRICT_CORDINATOR":
                return <DistrictCoordinatorForm />;
            default:
                return (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">Please select a partner type above to begin registration.</p>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Register New Partner</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {PARTNER_TYPES.map((type) => (
                    <div
                        key={type.value}
                        onClick={() => setSelectedType(type.value)}
                        className={`cursor-pointer rounded-xl p-4 border transition-all ${selectedType === type.value
                            ? "border-blue-600 bg-blue-50 shadow-md ring-1 ring-blue-600"
                            : "border-gray-200 hover:border-blue-400 hover:bg-gray-50 bg-white"
                            }`}
                    >
                        <div className={`text-3xl mb-3 ${selectedType === type.value ? "text-blue-600" : "text-gray-400"}`}>
                            {type.icon}
                        </div>
                        <h3 className={`font-semibold ${selectedType === type.value ? "text-blue-800" : "text-gray-700"}`}>
                            {type.label}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{type.hint}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {renderForm()}
            </div>
        </div>
    );
};

export default CreatePartner;
