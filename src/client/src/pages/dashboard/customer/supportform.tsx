import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { TextInput, Checkbox } from "../../../components/FormElements";
import { useCreateSupportMutation } from "../../../hooks/mutations";
import { useSupportById } from "../../../hooks/query";

interface OperationSupportFormData {
  // Patient Details
  patient_name: string;
  age: number;
  gender: string;
  relationship: string;

  // Treatment Details
  hospital_name: string;
  doctor_name: string;
  expected_surgery_date: string;
  type_of_surgery: string;
  estimated_cost: number;

  // Financial Condition
  monthly_income: number;
  number_of_dependents: number;
  has_insurance: boolean;
  required_support_percetage: number;

  // Additional Information
  additional_details: string;

  // Declaration
  is_terms_accepted: boolean;
}

type SupportFormParams = {
  id: string;
};

const OperationSupportForm: React.FC = () => {
  const navigate = useNavigate();
  const { id: supportId } = useParams<SupportFormParams>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<OperationSupportFormData>({
    defaultValues: {
      gender: "MALE",
      has_insurance: false,
      required_support_percetage: 10,
      is_terms_accepted: false,
    },
  });

  // Query
  const { data: supportData } = useSupportById(supportId);

  useEffect(() => {
    if (supportData) {
      // Populate form with existing data if editing
      reset(supportData);
    }
  }, [supportData, reset]);

  const createFormMutation = useCreateSupportMutation();

  const onSubmit = async (data: OperationSupportFormData) => {
    try {
      // Data is already in the correct format matching the API
      const payload = {
        patient_name: data.patient_name,
        age: data.age,
        gender: data.gender,
        relationship: data.relationship,
        hospital_name: data.hospital_name || null,
        doctor_name: data.doctor_name || null,
        expected_surgery_date: data.expected_surgery_date
          ? new Date(data.expected_surgery_date).toISOString()
          : null,
        type_of_surgery: data.type_of_surgery || null,
        estimated_cost: data.estimated_cost || null,
        monthly_income: data.monthly_income || null,
        number_of_dependents: data.number_of_dependents || null,
        has_insurance: data.has_insurance,
        required_support_percetage: data.required_support_percetage,
        additional_details: data.additional_details || null,
        is_terms_accepted: data.is_terms_accepted,
      };

      await createFormMutation.mutateAsync(payload);

      toast.success("Operation support request submitted successfully!");
      navigate("/dashboard/support");
    } catch (error: any) {
      console.error("Form submission error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit form. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Operation Support Form
        </h1>
        <p className="text-gray-600 mt-2">
          Apply for financial support for medical operations
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Details */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Patient Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Patient Name"
                placeholder=""
                {...register("patient_name", {
                  required: "Patient Name is required",
                })}
                error={errors.patient_name?.message}
                required
              />

              <TextInput
                label="Age"
                placeholder=""
                type="number"
                {...register("age", {
                  required: "Age is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Age must be positive" },
                })}
                error={errors.age?.message}
                required
              />

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">
                    Gender <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  className={`select select-bordered w-full ${errors.gender ? "select-error" : ""
                    }`}
                  {...register("gender", { required: "Gender is required" })}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.gender && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.gender.message}
                    </span>
                  </label>
                )}
              </div>

              <TextInput
                label="Relationship"
                placeholder="Self / Family Member"
                {...register("relationship", {
                  required: "Relationship is required",
                })}
                error={errors.relationship?.message}
                required
              />
            </div>
          </div>
        </div>

        {/* Treatment Details */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Treatment Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Hospital Name"
                placeholder="Optional"
                {...register("hospital_name")}
                error={errors.hospital_name?.message}
              />

              <TextInput
                label="Doctor Name"
                placeholder="Optional"
                {...register("doctor_name")}
                error={errors.doctor_name?.message}
              />

              <TextInput
                label="Expected Operation Date"
                type="date"
                {...register("expected_surgery_date")}
                error={errors.expected_surgery_date?.message}
              />

              <TextInput
                label="Type of Operation"
                placeholder="Optional"
                {...register("type_of_surgery")}
                error={errors.type_of_surgery?.message}
              />

              <TextInput
                label="Estimated Cost (₹)"
                placeholder="Optional"
                type="number"
                {...register("estimated_cost", { valueAsNumber: true })}
                error={errors.estimated_cost?.message}
              />
            </div>
          </div>
        </div>

        {/* Financial Condition */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Financial Condition</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Monthly Income (₹)"
                placeholder=""
                type="number"
                {...register("monthly_income", { valueAsNumber: true })}
                error={errors.monthly_income?.message}
              />

              <TextInput
                label="Number of Dependents"
                placeholder=""
                type="number"
                {...register("number_of_dependents", { valueAsNumber: true })}
                error={errors.number_of_dependents?.message}
              />

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Insurance?</span>
                </label>
                <select
                  className={`select select-bordered w-full ${errors.has_insurance ? "select-error" : ""
                    }`}
                  {...register("has_insurance", {
                    setValueAs: (value) => value === "true",
                  })}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
                {errors.has_insurance && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.has_insurance.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">
                    Required Support % <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  className={`select select-bordered w-full ${errors.required_support_percetage ? "select-error" : ""
                    }`}
                  {...register("required_support_percetage", {
                    required: "Required Support is required",
                    setValueAs: (value) => parseInt(value),
                  })}
                >
                  <option value="10">10%</option>
                  <option value="20">20%</option>
                  <option value="30">30%</option>
                  <option value="40">40%</option>
                  <option value="50">50%</option>
                  <option value="60">60%</option>
                  <option value="70">70%</option>
                  <option value="80">80%</option>
                  <option value="90">90%</option>
                  <option value="100">100%</option>
                </select>
                {errors.required_support_percetage && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.required_support_percetage.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Additional Information</h2>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Description / Notes</span>
              </label>
              <textarea
                className={`textarea textarea-bordered h-32 ${errors.additional_details ? "textarea-error" : ""
                  }`}
                placeholder="Please provide any additional information that may help us process your request..."
                {...register("additional_details")}
              />
              {errors.additional_details && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.additional_details.message}
                  </span>
                </label>
              )}
            </div>

            <div className="alert alert-info mt-4">
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
              <span className="text-sm">
                <strong>Note:</strong> Document upload feature will be available
                after form submission. Please keep ready: Prescription, Hospital
                Estimate, Previous Reports, and ID Proof.
              </span>
            </div>
          </div>
        </div>

        {/* Declaration */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <Controller
              name="is_terms_accepted"
              control={control}
              rules={{ required: "You must accept the declaration to proceed" }}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  label="I declare that the information provided above is true and accurate to the best of my knowledge. I understand that any false information may result in rejection of my application."
                  error={errors.is_terms_accepted?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-primary btn-wide btn-lg"
            disabled={createFormMutation.isPending}
          >
            {createFormMutation.isPending ? (
              <>
                <span className="loading loading-spinner"></span>
                Submitting...
              </>
            ) : (
              "Submit Operation Support Request"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OperationSupportForm;
