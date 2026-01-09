import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import GooglePlacesAutoComplete from "../../../components/googlePlacesAutoComplete";

// Enums matching Prisma schema
enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

enum AyushmanCardStatus {
  YES = "YES",
  NO = "NO",
}

// Form data interface matching User model from Prisma schema
interface CreateCustomerFormData {
  // Personal Information
  first_name: string;
  last_name: string;
  email?: string;
  guardian_name?: string;
  gender?: Gender;
  age?: number;
  mobile: string;
  dob?: string;
  password?: string;

  // Address Information
  village?: string;
  block?: string;
  district?: string;
  state?: string;
  pincode?: string;

  // Additional Information
  ayushmanCardAvailable?: AyushmanCardStatus;

  // Consent
  customerConsent: boolean;
  termsAccepted: boolean;
}

const CreateCustomer: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateCustomerFormData>({
    defaultValues: {
      customerConsent: false,
      termsAccepted: false,
    },
  });

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Watch gender and ayushman card status for controlled inputs
  const selectedGender = watch("gender");
  const ayushmanCard = watch("ayushmanCardAvailable");

  const onSubmit = async (data: CreateCustomerFormData) => {
    try {
      console.log("Form Data:", data);
      // TODO: Integrate with backend API
      // const response = await fetch('/api/customers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // const result = await response.json();
      alert("Customer created successfully!");
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Failed to create customer. Please try again.");
    }
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    console.log("Selected place:", place);

    // Extract location coordinates
    if (place.geometry?.location) {
      setSelectedLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }

    // Parse address components
    const addressComponents = place.address_components || [];

    addressComponents.forEach((component) => {
      const types = component.types;

      if (types.includes("locality") || types.includes("sublocality")) {
        setValue("village", component.long_name);
      }
      if (types.includes("administrative_area_level_3")) {
        setValue("block", component.long_name);
      }
      if (
        types.includes("administrative_area_level_2") ||
        types.includes("administrative_area_level_1")
      ) {
        setValue("district", component.long_name);
      }
      if (types.includes("administrative_area_level_1")) {
        setValue("state", component.long_name);
      }
      if (types.includes("postal_code")) {
        setValue("pincode", component.long_name);
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Create Customer - Bonchi</title>
      </Helmet>

      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="card-title text-3xl mb-6">Create Customer</h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information Section */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          First Name <span className="text-error">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter first name"
                        className={`input input-bordered w-full ${
                          errors.first_name ? "input-error" : ""
                        }`}
                        {...register("first_name", {
                          required: "First name is required",
                        })}
                      />
                      {errors.first_name && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.first_name.message}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          Last Name <span className="text-error">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter last name"
                        className={`input input-bordered w-full ${
                          errors.last_name ? "input-error" : ""
                        }`}
                        {...register("last_name", {
                          required: "Last name is required",
                        })}
                      />
                      {errors.last_name && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.last_name.message}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Guardian Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Guardian Name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter guardian name"
                        className="input input-bordered w-full"
                        {...register("guardian_name")}
                      />
                    </div>

                    {/* Gender */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Gender</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        {...register("gender")}
                      >
                        <option value="">Select gender</option>
                        <option value={Gender.MALE}>Male</option>
                        <option value={Gender.FEMALE}>Female</option>
                        <option value={Gender.OTHER}>Other</option>
                      </select>
                    </div>

                    {/* Age */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Age</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter age"
                        className="input input-bordered w-full"
                        {...register("age", {
                          valueAsNumber: true,
                          min: { value: 0, message: "Age must be positive" },
                          max: {
                            value: 150,
                            message: "Age must be realistic",
                          },
                        })}
                      />
                      {errors.age && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.age.message}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Date of Birth</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        {...register("dob")}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Contact Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mobile */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          Mobile Number <span className="text-error">*</span>
                        </span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter mobile number"
                        className={`input input-bordered w-full ${
                          errors.mobile ? "input-error" : ""
                        }`}
                        {...register("mobile", {
                          required: "Mobile number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Invalid mobile number (10 digits)",
                          },
                        })}
                      />
                      {errors.mobile && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.mobile.message}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Email */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Enter email address"
                        className={`input input-bordered w-full ${
                          errors.email ? "input-error" : ""
                        }`}
                        {...register("email", {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                      />
                      {errors.email && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.email.message}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Password */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Enter password"
                        className={`input input-bordered w-full ${
                          errors.password ? "input-error" : ""
                        }`}
                        {...register("password", {
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      {errors.password && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.password.message}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Address Information
                  </h2>

                  <div className="space-y-4">
                    {/* Google Places Autocomplete */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Search Location</span>
                      </label>
                      <GooglePlacesAutoComplete
                        onPlaceSelect={handlePlaceSelect}
                        placeholder="Search for your address..."
                        types={["geocode"]}
                        currentLocation={selectedLocation || undefined}
                        componentRestrictions={{ country: "in" }}
                        className="w-full"
                      />
                      <label className="label">
                        <span className="label-text-alt">
                          Search and select to auto-fill address fields
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Village */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Village/City</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter village or city"
                          className="input input-bordered w-full"
                          {...register("village")}
                        />
                      </div>

                      {/* Block */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Block</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter block"
                          className="input input-bordered w-full"
                          {...register("block")}
                        />
                      </div>

                      {/* District */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">District</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter district"
                          className="input input-bordered w-full"
                          {...register("district")}
                        />
                      </div>

                      {/* State */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">State</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter state"
                          className="input input-bordered w-full"
                          {...register("state")}
                        />
                      </div>

                      {/* Pincode */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Pincode</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter pincode"
                          className={`input input-bordered w-full ${
                            errors.pincode ? "input-error" : ""
                          }`}
                          {...register("pincode", {
                            pattern: {
                              value: /^[0-9]{6}$/,
                              message: "Invalid pincode (6 digits)",
                            },
                          })}
                        />
                        {errors.pincode && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {errors.pincode.message}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Additional Information
                  </h2>

                  {/* Ayushman Card */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        Ayushman Card Available?
                      </span>
                    </label>
                    <div className="flex gap-4">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          className="radio radio-primary"
                          value={AyushmanCardStatus.YES}
                          {...register("ayushmanCardAvailable")}
                        />
                        <span className="label-text">Yes</span>
                      </label>
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          className="radio radio-primary"
                          value={AyushmanCardStatus.NO}
                          {...register("ayushmanCardAvailable")}
                        />
                        <span className="label-text">No</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Consent Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Consent & Terms
                  </h2>

                  {/* Customer Consent */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                        type="checkbox"
                        className={`checkbox checkbox-primary ${
                          errors.customerConsent ? "checkbox-error" : ""
                        }`}
                        {...register("customerConsent", {
                          required: "Customer consent is required",
                        })}
                      />
                      <span className="label-text">
                        I consent to the collection and processing of my
                        personal data <span className="text-error">*</span>
                      </span>
                    </label>
                    {errors.customerConsent && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.customerConsent.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Terms Accepted */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                        type="checkbox"
                        className={`checkbox checkbox-primary ${
                          errors.termsAccepted ? "checkbox-error" : ""
                        }`}
                        {...register("termsAccepted", {
                          required: "You must accept the terms and conditions",
                        })}
                      />
                      <span className="label-text">
                        I accept the terms and conditions{" "}
                        <span className="text-error">*</span>
                      </span>
                    </label>
                    {errors.termsAccepted && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.termsAccepted.message}
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="card-actions justify-end pt-6">
                  <button
                    type="button"
                    className="btn btn-ghost"
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
                        <span className="loading loading-spinner loading-sm"></span>
                        Creating...
                      </>
                    ) : (
                      "Create Customer"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCustomer;
