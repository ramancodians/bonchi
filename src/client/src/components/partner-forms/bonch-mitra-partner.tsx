import React from "react";
import { useForm } from "react-hook-form";
import TextInput from "../FormElements/TextInput";
import Checkbox from "../FormElements/Checkbox";
import { useCreatePartnerMutation } from "../../hooks/mutations";

// Enums matching Prisma schema
enum BusinessType {
  MOBILE_SHOP = "MOBILE_SHOP",
  INTERNET_CENTRE = "INTERNET_CENTRE",
  CYBER_CAFE = "CYBER_CAFE",
  MEDICAL_STORE = "MEDICAL_STORE",
  OTHER = "OTHER",
}

enum AreaType {
  RURAL = "RURAL",
  SEMI_URBAN = "SEMI_URBAN",
  URBAN = "URBAN",
}

// Form data interface matching BonchiMitraPartner model
interface BonchiMitraPartnerFormData {
  // User credentials
  mobile: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;

  // Personal Information
  alternate_mobile_number?: string;
  email?: string;

  // Identity Verification
  aadhaar_number: string;
  pan_number: string;
  live_photo_url?: string;
  shop_photo_url?: string;

  // Shop / Work Details
  shop_centre_name: string;
  business_types: BusinessType[];
  business_other?: string;

  // Address Details
  shop_address: string;
  village_ward?: string;
  block?: string;
  district?: string;
  state?: string;
  pincode?: string;

  // Mapping & Control
  area_type?: AreaType;

  // Bank / Payout
  bank_account_holder_name: string;
  bank_account_number: string;
  bank_ifsc_code: string;
  bank_name: string;
  upi_id?: string;

  // Agreement & Consent
  agent_agreement_accepted: boolean;
  commission_structure_accepted: boolean;
  data_privacy_consent: boolean;
}

const BonchiMitraPartnerForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<BonchiMitraPartnerFormData>({
    defaultValues: {
      business_types: [],
      agent_agreement_accepted: false,
      commission_structure_accepted: false,
      data_privacy_consent: false,
    },
  });

  const { mutate: createPartner, isPending } = useCreatePartnerMutation();

  const password = watch("password");
  const showOtherBusiness = watch("business_types")?.includes(
    BusinessType.OTHER
  );

  const onSubmit = async (data: BonchiMitraPartnerFormData) => {
    // Prepare payload with role
    const payload = {
      ...data,
      role: "BONCHI_MITRA",
    };

    createPartner(payload, {
      onSuccess: () => {
        alert("Bonchi Mitra Partner created successfully!");
        reset();
        // TODO: Navigate to partner list or show success message
      },
      onError: (error: any) => {
        console.error("Error creating Bonchi Mitra partner:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create Bonchi Mitra partner. Please try again.";
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
            label="Mobile Number (WhatsApp Active - OTP Verified)"
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

      {/* Identity Verification Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Identity Verification
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Aadhaar Number"
            placeholder="Enter 12-digit Aadhaar number"
            error={errors.aadhaar_number?.message}
            {...register("aadhaar_number", {
              required: "Aadhaar number is required",
              pattern: {
                value: /^\d{12}$/,
                message: "Please enter a valid 12-digit Aadhaar number",
              },
            })}
          />

          <TextInput
            label="PAN Number"
            placeholder="Enter PAN number"
            error={errors.pan_number?.message}
            {...register("pan_number", {
              required: "PAN number is required for commission payout",
              pattern: {
                value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                message: "Please enter a valid PAN number",
              },
            })}
          />

          <TextInput
            label="Live Photo URL"
            placeholder="Upload or enter photo URL"
            error={errors.live_photo_url?.message}
            {...register("live_photo_url")}
          />

          <TextInput
            label="Shop Photo URL"
            placeholder="Upload or enter shop photo URL"
            error={errors.shop_photo_url?.message}
            {...register("shop_photo_url")}
          />
        </div>
      </div>

      {/* Shop / Work Details Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Shop / Work Details
        </h2>

        <div className="space-y-4">
          <TextInput
            label="Shop / Centre Name"
            placeholder="Enter shop or centre name"
            error={errors.shop_centre_name?.message}
            {...register("shop_centre_name", {
              required: "Shop/Centre name is required",
            })}
          />

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Business Type (Multi-select)
              </span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-2">
              <Checkbox
                label="Mobile Shop"
                value={BusinessType.MOBILE_SHOP}
                {...register("business_types")}
              />
              <Checkbox
                label="Internet Centre"
                value={BusinessType.INTERNET_CENTRE}
                {...register("business_types")}
              />
              <Checkbox
                label="Cyber Cafe"
                value={BusinessType.CYBER_CAFE}
                {...register("business_types")}
              />
              <Checkbox
                label="Medical Store"
                value={BusinessType.MEDICAL_STORE}
                {...register("business_types")}
              />
              <Checkbox
                label="Other"
                value={BusinessType.OTHER}
                {...register("business_types")}
              />
            </div>
            {errors.business_types?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.business_types.message}
                </span>
              </label>
            )}
          </div>

          {showOtherBusiness && (
            <TextInput
              label="Other Business Type (Please specify)"
              placeholder="Enter other business type"
              error={errors.business_other?.message}
              {...register("business_other")}
            />
          )}
        </div>
      </div>

      {/* Address Details Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Shop Address
        </h2>

        <div className="space-y-4">
          <TextInput
            label="Shop Address"
            placeholder="Enter complete shop address"
            error={errors.shop_address?.message}
            {...register("shop_address", {
              required: "Shop address is required",
            })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Village / Ward"
              placeholder="Enter village or ward"
              error={errors.village_ward?.message}
              {...register("village_ward")}
            />

            <TextInput
              label="Block"
              placeholder="Select or enter block"
              error={errors.block?.message}
              {...register("block")}
            />

            <TextInput
              label="District"
              placeholder="Select or enter district"
              error={errors.district?.message}
              {...register("district")}
            />

            <TextInput
              label="State"
              placeholder="Select or enter state"
              error={errors.state?.message}
              {...register("state")}
            />

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

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Area Type</span>
              </label>
              <select
                className={`select select-bordered ${
                  errors.area_type ? "select-error" : ""
                }`}
                {...register("area_type")}
              >
                <option value="">Select area type</option>
                <option value={AreaType.RURAL}>Rural</option>
                <option value={AreaType.SEMI_URBAN}>Semi-Urban</option>
                <option value={AreaType.URBAN}>Urban</option>
              </select>
              {errors.area_type?.message && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.area_type.message}
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bank / Payout Section */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Bank / Payout Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Bank Account Holder Name"
            placeholder="Enter account holder name"
            error={errors.bank_account_holder_name?.message}
            {...register("bank_account_holder_name", {
              required: "Account holder name is required",
            })}
          />

          <TextInput
            label="Account Number"
            placeholder="Enter account number"
            error={errors.bank_account_number?.message}
            {...register("bank_account_number", {
              required: "Account number is required",
            })}
          />

          <TextInput
            label="IFSC Code"
            placeholder="Enter IFSC code"
            error={errors.bank_ifsc_code?.message}
            {...register("bank_ifsc_code", {
              required: "IFSC code is required",
              pattern: {
                value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                message: "Please enter a valid IFSC code",
              },
            })}
          />

          <TextInput
            label="Bank Name"
            placeholder="Enter bank name"
            error={errors.bank_name?.message}
            {...register("bank_name", {
              required: "Bank name is required",
            })}
          />

          <TextInput
            label="UPI ID (Optional)"
            placeholder="Enter UPI ID"
            error={errors.upi_id?.message}
            {...register("upi_id")}
          />
        </div>
      </div>

      {/* Agreement & Consent Section */}
      <div className="pb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Agreement & Consent
        </h2>

        <div className="space-y-3 pl-2">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className={`checkbox checkbox-primary ${
                  errors.agent_agreement_accepted ? "checkbox-error" : ""
                }`}
                {...register("agent_agreement_accepted", {
                  required: "You must accept the agent agreement",
                })}
              />
              <span className="label-text">
                I accept the Agent Agreement ✅
              </span>
            </label>
            {errors.agent_agreement_accepted?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.agent_agreement_accepted.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className={`checkbox checkbox-primary ${
                  errors.commission_structure_accepted ? "checkbox-error" : ""
                }`}
                {...register("commission_structure_accepted", {
                  required: "You must accept the commission structure",
                })}
              />
              <span className="label-text">
                I accept the Commission Structure ✅
              </span>
            </label>
            {errors.commission_structure_accepted?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.commission_structure_accepted.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className={`checkbox checkbox-primary ${
                  errors.data_privacy_consent ? "checkbox-error" : ""
                }`}
                {...register("data_privacy_consent", {
                  required: "You must provide data privacy consent",
                })}
              />
              <span className="label-text">
                I provide Data Privacy Consent ✅
              </span>
            </label>
            {errors.data_privacy_consent?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.data_privacy_consent.message}
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
            "Create Bonchi Mitra Partner"
          )}
        </button>
      </div>
    </form>
  );
};

export default BonchiMitraPartnerForm;
