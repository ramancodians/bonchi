import React from "react";
import { useForm } from "react-hook-form";
import TextInput from "../FormElements/TextInput";
import Checkbox from "../FormElements/Checkbox";
import { useCreatePartnerMutation } from "../../hooks/mutations";

// Enums matching Prisma schema
enum HospitalType {
  MULTISPECIALITY_HOSPITAL = "MULTISPECIALITY_HOSPITAL",
  NURSING_HOME = "NURSING_HOME",
  CLINIC = "CLINIC",
  DIAGNOSTIC_CENTRE = "DIAGNOSTIC_CENTRE",
}

enum MedicalService {
  OPD_CONSULTATION = "OPD_CONSULTATION",
  IPD_ADMISSION = "IPD_ADMISSION",
  SURGERY_OPERATION = "SURGERY_OPERATION",
  DIAGNOSTIC_PATHOLOGY = "DIAGNOSTIC_PATHOLOGY",
  EMERGENCY_SERVICES = "EMERGENCY_SERVICES",
}

enum MedicalSpecialty {
  MEDICINE = "MEDICINE",
  SURGERY = "SURGERY",
  ORTHOPAEDIC = "ORTHOPAEDIC",
  GYNAECOLOGY = "GYNAECOLOGY",
  PAEDIATRICS = "PAEDIATRICS",
  ENT = "ENT",
  EYE = "EYE",
  DENTAL = "DENTAL",
  OTHER = "OTHER",
}

// Form data interface matching HospitalPartner model
interface HospitalPartnerFormData {
  // User credentials
  mobile: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;

  // Hospital Basic Details
  hospital_name: string;
  hospital_types: HospitalType[];
  registration_number: string;
  year_of_establishment?: number;

  // Contact Person Details
  contact_person_name: string;
  designation?: string;
  mobile_number: string;
  alternate_mobile_number?: string;
  email?: string;

  // Address Details
  full_address: string;
  area_locality?: string;
  block?: string;
  district?: string;
  state?: string;
  pincode?: string;

  // Medical Services Offered
  medical_services: MedicalService[];

  // Specialties Available
  specialties: MedicalSpecialty[];
  specialty_other?: string;

  // Bonchi Healthcard Benefit Agreement
  opd_discount?: number;
  diagnostic_discount?: number;
  surgery_discount?: number;
  free_services?: string;
}

interface HospitalPartnerFormProps {
  isCompact?: boolean;
}

const HospitalPartnerForm: React.FC<HospitalPartnerFormProps> = ({
  isCompact = true,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<HospitalPartnerFormData>({
    defaultValues: {
      hospital_types: [],
      medical_services: [],
      specialties: [],
    },
  });

  const { mutate: createPartner, isPending } = useCreatePartnerMutation();

  const password = watch("password");
  const showOtherSpecialty = watch("specialties")?.includes(
    MedicalSpecialty.OTHER
  );

  const onSubmit = async (data: HospitalPartnerFormData) => {
    // Prepare payload with role
    const payload = {
      ...data,
      role: "HOSPITAL_PARTNER",
    };

    createPartner(payload, {
      onSuccess: () => {
        alert("Hospital Partner created successfully!");
        reset();
        // TODO: Navigate to partner list or show success message
      },
      onError: (error: any) => {
        console.error("Error creating hospital partner:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create hospital partner. Please try again.";
        alert(errorMessage);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Login Credentials Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Login Credentials
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            error={errors.first_name?.message}
            {...register("first_name", {
              required: "First name is required",
            })}
          />

          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            error={errors.last_name?.message}
            {...register("last_name", {
              required: "Last name is required",
            })}
          />

          <TextInput
            label="Mobile Number (for login)"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            error={errors.mobile?.message}
            {...register("mobile", {
              required: "Mobile number is required",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Please enter a valid 10-digit mobile number",
              },
            })}
          />

          <div></div>

          <TextInput
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          <TextInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            error={errors.confirm_password?.message}
            {...register("confirm_password", {
              required: "Please confirm password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
        </div>
      </div>

      {/* Hospital Basic Details Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Hospital Basic Details
        </h2>

        <div className="space-y-4">
          <TextInput
            label="Hospital / Clinic Name"
            placeholder="Enter hospital or clinic name"
            error={errors.hospital_name?.message}
            {...register("hospital_name", {
              required: "Hospital name is required",
            })}
          />

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Hospital Type (Multi-select)
              </span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-2">
              <Checkbox
                label="Multispeciality Hospital"
                value={HospitalType.MULTISPECIALITY_HOSPITAL}
                {...register("hospital_types")}
              />
              <Checkbox
                label="Nursing Home"
                value={HospitalType.NURSING_HOME}
                {...register("hospital_types")}
              />
              <Checkbox
                label="Clinic"
                value={HospitalType.CLINIC}
                {...register("hospital_types")}
              />
              <Checkbox
                label="Diagnostic Centre"
                value={HospitalType.DIAGNOSTIC_CENTRE}
                {...register("hospital_types")}
              />
            </div>
            {errors.hospital_types?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.hospital_types.message}
                </span>
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Registration Number"
              placeholder="Hospital / Clinic Reg. No."
              error={errors.registration_number?.message}
              {...register("registration_number", {
                required: "Registration number is required",
              })}
            />

            {!isCompact && (
              <TextInput
                label="Year of Establishment"
                type="number"
                placeholder="e.g., 2015"
                error={errors.year_of_establishment?.message}
                {...register("year_of_establishment", {
                  valueAsNumber: true,
                  min: {
                    value: 1900,
                    message: "Year must be after 1900",
                  },
                  max: {
                    value: new Date().getFullYear(),
                    message: "Year cannot be in the future",
                  },
                })}
              />
            )}
          </div>
        </div>
      </div>

      {/* Contact Person Details Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Contact Person Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Doctor / Owner / Manager Name"
            placeholder="Enter contact person name"
            error={errors.contact_person_name?.message}
            {...register("contact_person_name", {
              required: "Contact person name is required",
            })}
          />

          {!isCompact && (
            <TextInput
              label="Designation"
              placeholder="e.g., Owner, Manager, Doctor"
              error={errors.designation?.message}
              {...register("designation")}
            />
          )}

          <TextInput
            label="Mobile Number (OTP Verified)"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            error={errors.mobile_number?.message}
            {...register("mobile_number", {
              required: "Mobile number is required",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Please enter a valid 10-digit mobile number",
              },
            })}
          />

          {!isCompact && (
            <TextInput
              label="Alternate Mobile Number"
              type="tel"
              placeholder="Enter alternate mobile number"
              error={errors.alternate_mobile_number?.message}
              {...register("alternate_mobile_number", {
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              })}
            />
          )}

          {!isCompact && (
            <TextInput
              label="Email ID (Optional)"
              type="email"
              placeholder="Enter email address"
              error={errors.email?.message}
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
            />
          )}
        </div>
      </div>

      {/* Address Details Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Address Details
        </h2>

        <div className="space-y-4">
          <TextInput
            label="Full Address"
            placeholder="Enter complete address"
            error={errors.full_address?.message}
            {...register("full_address", {
              required: "Full address is required",
            })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isCompact && (
              <TextInput
                label="Area / Locality"
                placeholder="Enter area or locality"
                error={errors.area_locality?.message}
                {...register("area_locality")}
              />
            )}

            {!isCompact && (
              <TextInput
                label="Block"
                placeholder="Select or enter block"
                error={errors.block?.message}
                {...register("block")}
              />
            )}

            {!isCompact && (
              <TextInput
                label="District"
                placeholder="Select or enter district"
                error={errors.district?.message}
                {...register("district")}
              />
            )}

            {!isCompact && (
              <TextInput
                label="State"
                placeholder="Select or enter state"
                error={errors.state?.message}
                {...register("state")}
              />
            )}

            <TextInput
              label="PIN Code"
              placeholder="Enter 6-digit PIN code"
              error={errors.pincode?.message}
              {...register("pincode", {
                pattern: {
                  value: /^\d{6}$/,
                  message: "Please enter a valid 6-digit PIN code",
                },
              })}
            />
          </div>
        </div>
      </div>

      {/* Medical Services Offered Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Medical Services Offered
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-2">
          <Checkbox
            label="OPD Consultation"
            value={MedicalService.OPD_CONSULTATION}
            {...register("medical_services")}
          />
          <Checkbox
            label="IPD / Admission"
            value={MedicalService.IPD_ADMISSION}
            {...register("medical_services")}
          />
          <Checkbox
            label="Surgery / Operation"
            value={MedicalService.SURGERY_OPERATION}
            {...register("medical_services")}
          />
          <Checkbox
            label="Diagnostic / Pathology"
            value={MedicalService.DIAGNOSTIC_PATHOLOGY}
            {...register("medical_services")}
          />
          <Checkbox
            label="Emergency Services"
            value={MedicalService.EMERGENCY_SERVICES}
            {...register("medical_services")}
          />
        </div>
      </div>

      {/* Specialties Available Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Specialties Available (Multi-select)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pl-2">
          <Checkbox
            label="Medicine"
            value={MedicalSpecialty.MEDICINE}
            {...register("specialties")}
          />
          <Checkbox
            label="Surgery"
            value={MedicalSpecialty.SURGERY}
            {...register("specialties")}
          />
          <Checkbox
            label="Orthopaedic"
            value={MedicalSpecialty.ORTHOPAEDIC}
            {...register("specialties")}
          />
          <Checkbox
            label="Gynaecology"
            value={MedicalSpecialty.GYNAECOLOGY}
            {...register("specialties")}
          />
          <Checkbox
            label="Paediatrics"
            value={MedicalSpecialty.PAEDIATRICS}
            {...register("specialties")}
          />
          <Checkbox
            label="ENT"
            value={MedicalSpecialty.ENT}
            {...register("specialties")}
          />
          <Checkbox
            label="Eye"
            value={MedicalSpecialty.EYE}
            {...register("specialties")}
          />
          <Checkbox
            label="Dental"
            value={MedicalSpecialty.DENTAL}
            {...register("specialties")}
          />
          <Checkbox
            label="Other"
            value={MedicalSpecialty.OTHER}
            {...register("specialties")}
          />
        </div>

        {showOtherSpecialty && (
          <div className="mt-4">
            <TextInput
              label="Other Specialty (Please specify)"
              placeholder="Enter other specialty"
              error={errors.specialty_other?.message}
              {...register("specialty_other")}
            />
          </div>
        )}
      </div>

      {/* Bonchi Healthcard Benefit Agreement Section */}
      <div className="pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Bonchi Healthcard Benefit Agreement
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextInput
            label="OPD Discount (%)"
            type="number"
            placeholder="e.g., 10"
            error={errors.opd_discount?.message}
            {...register("opd_discount", {
              valueAsNumber: true,
              min: {
                value: 0,
                message: "Discount cannot be negative",
              },
              max: {
                value: 100,
                message: "Discount cannot exceed 100%",
              },
            })}
          />

          <TextInput
            label="Diagnostic Discount (%)"
            type="number"
            placeholder="e.g., 15"
            error={errors.diagnostic_discount?.message}
            {...register("diagnostic_discount", {
              valueAsNumber: true,
              min: {
                value: 0,
                message: "Discount cannot be negative",
              },
              max: {
                value: 100,
                message: "Discount cannot exceed 100%",
              },
            })}
          />

          <TextInput
            label="Surgery / Procedure Discount (%)"
            type="number"
            placeholder="e.g., 20"
            error={errors.surgery_discount?.message}
            {...register("surgery_discount", {
              valueAsNumber: true,
              min: {
                value: 0,
                message: "Discount cannot be negative",
              },
              max: {
                value: 100,
                message: "Discount cannot exceed 100%",
              },
            })}
          />
        </div>

        <div className="mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Free Services (if any)</span>
            </label>
            <textarea
              className={`textarea textarea-bordered w-full h-24 ${
                errors.free_services ? "textarea-error" : ""
              }`}
              placeholder="List any free services offered to Bonchi Healthcard holders"
              {...register("free_services")}
            />
            {errors.free_services?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.free_services.message}
                </span>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              Creating...
            </>
          ) : (
            "Create Hospital Partner"
          )}
        </button>
      </div>
    </form>
  );
};

export default HospitalPartnerForm;
