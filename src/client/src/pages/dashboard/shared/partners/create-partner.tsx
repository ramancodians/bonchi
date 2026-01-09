import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { PARTNER_TYPES } from "../../../../config/consts";
import HospitalPartnerForm from "../../../../components/partner-forms/hospital-partner";

const CreatePartner: React.FC = () => {
  const [selectedPartnerType, setSelectedPartnerType] = useState<string | null>(
    null
  );

  const renderPartnerTypeSelector = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Select Partner Type
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PARTNER_TYPES.map((partnerType) => {
            const Icon = partnerType.icon;
            const isSelected = selectedPartnerType === partnerType.value;

            return (
              <button
                key={partnerType.value}
                type="button"
                onClick={() => setSelectedPartnerType(partnerType.value)}
                className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 border-2 ${
                  isSelected
                    ? "border-primary bg-primary/50"
                    : "border-base-300 hover:border-primary/50"
                }`}
              >
                <div className="card-body items-center text-center">
                  <Icon
                    className={`text-6xl mb-4 ${
                      isSelected ? "text-primary" : "text-base-content/70"
                    }`}
                  />
                  <h3 className="card-title text-xl">{partnerType.label}</h3>
                  {isSelected && (
                    <div className="badge badge-primary mt-2">Selected</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {selectedPartnerType && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => setSelectedPartnerType(null)}
              className="btn btn-outline btn-sm"
            >
              Change Partner Type
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderPartnerForm = () => {
    switch (selectedPartnerType) {
      case "HOSPITAL_PARTNER":
        return <HospitalPartnerForm />;
      case "BONCHI_MITRA":
        return (
          <div className="text-center py-8">
            <p className="text-lg text-base-content/70">
              Bonchi Mitra form coming soon...
            </p>
          </div>
        );
      case "HEALTH_ASSISTANT":
        return (
          <div className="text-center py-8">
            <p className="text-lg text-base-content/70">
              Health Assistant form coming soon...
            </p>
          </div>
        );
      case "MEDICAL_STORE":
        return (
          <div className="text-center py-8">
            <p className="text-lg text-base-content/70">
              Medical Store form coming soon...
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Partner - Bonchi</title>
      </Helmet>

      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="card-title text-3xl mb-6">Create Partner</h1>

              {!selectedPartnerType ? (
                renderPartnerTypeSelector()
              ) : (
                <div className="space-y-6">{renderPartnerForm()}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePartner;
