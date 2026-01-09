import React from "react";
import { useForm } from "react-hook-form";
import TextInput from "../FormElements/TextInput";
import Checkbox from "../FormElements/Checkbox";
import { useCreatePartnerMutation } from "../../hooks/mutations";

// Form data interface matching MedicalStore model
interface MedicalStoreFormData {
  // User credentials
  mobile: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;

  // Store Basic Details
  store_name: string;
  owner_name: string;
  drug_license_number: string;
  gst_number?: string;

  // Contact Details
  mobile_number: string;
  alternate_mobile_number?: string;
  email?: string;

  // Store Address
  full_address: string;
  area_locality?: string;
  block?: string;
  district?: string;
  state?: string;
  pincode?: string;

  // Services & Discounts
  medicine_discount?: number;
  generic_medicine_discount?: number;
  home_delivery_available: boolean;

  // Bonchi Healthcard Agreement
  bonchi_healthcard_accepted: boolean;
  display_partner_board: boolean;

  // Documents
  drug_license_copy_url?: string;
  store_photo_url?: string;
  owner_aadhaar_pan_url?: string;

  // Consent & Declaration
  discount_agreement_consent: boolean;
  insurance_understanding: boolean;
  terms_accepted: boolean;
}

interface MedicalStorePartnerFormProps {
  isCompact?: boolean;
}

const MedicalStorePartnerForm: React.FC<MedicalStorePartnerFormProps> = ({
  isCompact = true,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<MedicalStoreFormData>({
    defaultValues: {
      home_delivery_available: false,
      bonchi_healthcard_accepted: true,
      display_partner_board: true,
      discount_agreement_consent: false,
      insurance_understanding: false,
      terms_accepted: false,
    },
  });

  const { mutate: createPartner, isPending } = useCreatePartnerMutation();

  const password = watch("password");

  const onSubmit = async (data: MedicalStoreFormData) => {
    // Validate consent checkboxes
    if (!data.discount_agreement_consent) {
      alert("Please agree to the discount agreement");
      return;
    }
    if (!data.insurance_understanding) {
      alert("Please confirm understanding of insurance terms");
      return;
    }
    if (!data.terms_accepted) {
      alert("Please accept the terms and conditions");
      return;
    }

    // Prepare payload with role
    const payload = {
      ...data,
      role: "MEDICAL_STORE",
    };

    createPartner(payload, {
      onSuccess: () => {
        alert("Medical Store Partner created successfully!");
        reset();
        // TODO: Navigate to partner list or show success message
      },
      onError: (error: any) => {
        console.error("Error creating medical store partner:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create medical store partner. Please try again.";
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

      {/* Store Basic Details Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Medical Store Basic Details
        </h2>

        <div className="space-y-4">
          <TextInput
            label="Medical Store Name"
            placeholder="Enter store name"
            error={errors.store_name?.message}
            {...register("store_name", {
              required: "Store name is required",
            })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Owner Name"
              placeholder="Enter owner's full name"
              error={errors.owner_name?.message}
              {...register("owner_name", {
                required: "Owner name is required",
              })}
            />

            <TextInput
              label="Drug License Number"
              placeholder="Enter drug license number"
              error={errors.drug_license_number?.message}
              {...register("drug_license_number", {
                required: "Drug license number is required",
              })}
            />

            {!isCompact && (
              <TextInput
                label="GST Number (Optional)"
                placeholder="Enter GST number"
                error={errors.gst_number?.message}
                {...register("gst_number", {
                  pattern: {
                    value:
                      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                    message: "Please enter a valid GST number",
                  },
                })}
              />
            )}
          </div>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Contact Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Mobile Number (WhatsApp Active - OTP Verified)"
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
              label="Alternate Mobile Number (Optional)"
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

      {/* Store Address Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Store Address
        </h2>

        <div className="space-y-4">
          <TextInput
            label="Full Address"
            placeholder="Enter complete store address"
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

      {/* Services & Discounts Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Services & Discounts
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Medicine Discount for Bonchi Healthcard Holders (%)"
              type="number"
              placeholder="e.g., 10"
              error={errors.medicine_discount?.message}
              {...register("medicine_discount", {
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
              label="Generic Medicine Discount (%)"
              type="number"
              placeholder="e.g., 15"
              error={errors.generic_medicine_discount?.message}
              {...register("generic_medicine_discount", {
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

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register("home_delivery_available")}
              />
              <span className="label-text">
                Home Delivery Service Available
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Bonchi Healthcard Agreement Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Bonchi Healthcard Partner Agreement
        </h2>

        <div className="space-y-3">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register("bonchi_healthcard_accepted")}
              />
              <span className="label-text">
                I agree to honor discounts for Bonchi Healthcard holders
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register("display_partner_board")}
              />
              <span className="label-text">
                I agree to display the Bonchi Partner Board at my store
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      {!isCompact && (
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Document Uploads (Optional)
          </h2>

          <div className="space-y-4">
            <TextInput
              label="Drug License Copy URL"
              placeholder="Upload or enter drug license document URL"
              error={errors.drug_license_copy_url?.message}
              {...register("drug_license_copy_url", {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Please enter a valid URL",
                },
              })}
            />

            <TextInput
              label="Store Photo URL"
              placeholder="Upload or enter store photo URL"
              error={errors.store_photo_url?.message}
              {...register("store_photo_url", {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Please enter a valid URL",
                },
              })}
            />

            <TextInput
              label="Owner Aadhaar / PAN URL"
              placeholder="Upload or enter owner's Aadhaar/PAN document URL"
              error={errors.owner_aadhaar_pan_url?.message}
              {...register("owner_aadhaar_pan_url", {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Please enter a valid URL",
                },
              })}
            />

            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                Document upload functionality will be implemented later. For
                now, you can provide URLs if documents are hosted elsewhere.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Consent & Declaration Section */}
      <div className="pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Consent & Declaration
        </h2>

        <div className="space-y-3">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register("discount_agreement_consent", {
                  required: "This consent is required",
                })}
              />
              <span className="label-text">
                I agree to provide the agreed discount to all Bonchi Healthcard
                holders and understand that this is a binding agreement
              </span>
            </label>
            {errors.discount_agreement_consent?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.discount_agreement_consent.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register("insurance_understanding", {
                  required: "This confirmation is required",
                })}
              />
              <span className="label-text">
                I understand that Bonchi Healthcard is NOT an insurance scheme,
                but a discount/benefit card for partner services
              </span>
            </label>
            {errors.insurance_understanding?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.insurance_understanding.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register("terms_accepted", {
                  required: "You must accept the terms and conditions",
                })}
              />
              <span className="label-text">
                I accept all the terms and conditions of the Bonchi Partner
                Program
              </span>
            </label>
            {errors.terms_accepted?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.terms_accepted.message}
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
          disabled={isSubmitting || isPending}
        >
          {isSubmitting || isPending ? (
            <>
              <span className="loading loading-spinner"></span>
              Creating...
            </>
          ) : (
            "Create Medical Store Partner"
          )}
        </button>
      </div>
    </form>
  );
};

export default MedicalStorePartnerForm;
