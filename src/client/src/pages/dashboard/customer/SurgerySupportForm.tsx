import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaHospital, FaRupeeSign, FaPhoneAlt, FaCheckCircle, FaFileUpload } from "react-icons/fa";
import { useCreateSupportMutation } from "../../../hooks/mutations";

// Define the form data interface
interface SurgerySupportFormData {
    // Step 1: Patient Details
    patient_name: string;
    age: number;
    gender: string;
    mobile: string;
    email?: string;
    address_village: string;
    address_block: string;
    address_district: string;
    address_state: string;

    // Step 2: Medical Details
    hospital_name: string;
    doctor_name: string;
    type_of_surgery: string;
    estimated_cost: number;
    file_url?: string; // Base64 string

    // Step 3: Financial Support
    ayushmanCardAvailable: string; // "YES" | "NO"
    previous_assistance: boolean;
    ngo_support: boolean;
    monthly_income: number; // Added to match schema if needed, defaulting

    // Step 4: Emergency Contact
    guardian_name: string;
    guardian_relation: string;
    guardian_number: string;

    // Step 5: Declaration
    is_terms_accepted: boolean;
}

const SurgerySupportForm: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
        trigger
    } = useForm<SurgerySupportFormData>({
        defaultValues: {
            gender: "MALE",
            type_of_surgery: "General",
            ayushmanCardAvailable: "NO",
            previous_assistance: false,
            ngo_support: false,
            is_terms_accepted: false,
        },
    });

    const createMutation = useCreateSupportMutation();

    // Helper to convert file to base64
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("File size too large (Max 5MB)");
                return;
            }
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue("file_url", reader.result as string);
                setIsUploading(false);
                toast.success("File attached successfully");
            };
            reader.readAsDataURL(file);
        }
    };

    const nextStep = async () => {
        let fieldsToValidate: (keyof SurgerySupportFormData)[] = [];

        switch (step) {
            case 1:
                fieldsToValidate = ['patient_name', 'age', 'gender', 'mobile', 'address_village', 'address_block', 'address_district', 'address_state'];
                break;
            case 2:
                fieldsToValidate = ['hospital_name', 'doctor_name', 'type_of_surgery', 'estimated_cost'];
                break;
            case 3:
                fieldsToValidate = ['ayushmanCardAvailable', 'monthly_income'];
                break;
            case 4:
                fieldsToValidate = ['guardian_name', 'guardian_relation', 'guardian_number'];
                break;
        }

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setStep((prev) => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setStep((prev) => prev - 1);
        window.scrollTo(0, 0);
    };

    const onSubmit = async (data: SurgerySupportFormData) => {
        try {
            const payload = {
                ...data,
                relationship: "Self/Family", // Defaulting as specific field wasn't requested in Step 1 but schema needs it
                has_insurance: data.ayushmanCardAvailable === "YES", // Mapping
                required_support_percetage: 0, // Default
            };

            await createMutation.mutateAsync(payload as any);
            toast.success("Support Request Submitted Successfully!");
            navigate("/dashboard/customer");
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to submit request.");
        }
    };

    // Render Steps
    const renderStepIndicator = () => (
        <div className="flex justify-center mb-8">
            <ul className="steps steps-vertical lg:steps-horizontal w-full">
                <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Patient</li>
                <li className={`step ${step >= 2 ? "step-primary" : ""}`}>Medical</li>
                <li className={`step ${step >= 3 ? "step-primary" : ""}`}>Financial</li>
                <li className={`step ${step >= 4 ? "step-primary" : ""}`}>Guardian</li>
                <li className={`step ${step >= 5 ? "step-primary" : ""}`}>Submit</li>
            </ul>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-primary p-6 text-white text-center">
                    <h1 className="text-2xl font-bold">Surgery Support Form</h1>
                    <p className="text-primary-content/80 text-sm">Get financial assistance for your surgery</p>
                </div>

                <div className="p-6">
                    {renderStepIndicator()}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* STEP 1: Patient Details */}
                        {step === 1 && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <FaUser className="text-primary" /> Patient Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label text-sm font-medium">Full Name *</label>
                                        <input {...register("patient_name", { required: "Name is required" })} className="input input-bordered w-full" placeholder="Enter patient name" />
                                        {errors.patient_name && <span className="text-error text-xs mt-1">{errors.patient_name.message}</span>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-sm font-medium">Age *</label>
                                        <input type="number" {...register("age", { required: "Age is required", min: 0 })} className="input input-bordered w-full" placeholder="Age" />
                                        {errors.age && <span className="text-error text-xs mt-1">{errors.age.message}</span>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-sm font-medium">Gender *</label>
                                        <select {...register("gender")} className="select select-bordered w-full">
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-sm font-medium">Mobile Number *</label>
                                        <input type="tel" {...register("mobile", { required: "Mobile is required", pattern: { value: /^[0-9]{10}$/, message: "Invalid mobile" } })} className="input input-bordered w-full" placeholder="10-digit number" />
                                        {errors.mobile && <span className="text-error text-xs mt-1">{errors.mobile.message}</span>}
                                    </div>
                                    <div className="form-control col-span-1 md:col-span-2">
                                        <label className="label text-sm font-medium">Email (Optional)</label>
                                        <input type="email" {...register("email")} className="input input-bordered w-full" placeholder="email@example.com" />
                                    </div>

                                    <div className="divider col-span-1 md:col-span-2 text-sm text-gray-400">Address</div>

                                    <div className="form-control">
                                        <label className="label text-sm font-medium">Village / Ward *</label>
                                        <input {...register("address_village", { required: "Village is required" })} className="input input-bordered w-full" />
                                        {errors.address_village && <span className="text-error text-xs mt-1">{errors.address_village.message}</span>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-sm font-medium">Block *</label>
                                        <input {...register("address_block", { required: "Block is required" })} className="input input-bordered w-full" />
                                        {errors.address_block && <span className="text-error text-xs mt-1">{errors.address_block.message}</span>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-sm font-medium">District *</label>
                                        <input {...register("address_district", { required: "District is required" })} className="input input-bordered w-full" />
                                        {errors.address_district && <span className="text-error text-xs mt-1">{errors.address_district.message}</span>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-sm font-medium">State *</label>
                                        <input {...register("address_state", { required: "State is required" })} className="input input-bordered w-full" />
                                        {errors.address_state && <span className="text-error text-xs mt-1">{errors.address_state.message}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Medical Details */}
                        {step === 2 && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <FaHospital className="text-primary" /> Medical Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control col-span-1 md:col-span-2">
                                        <label className="label text-sm font-medium">Hospital Name (Where surgery planned) *</label>
                                        <input {...register("hospital_name", { required: "Hospital name is required" })} className="input input-bordered w-full" />
                                        {errors.hospital_name && <span className="text-error text-xs mt-1">{errors.hospital_name.message}</span>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-sm font-medium">Doctor Name & Department *</label>
                                        <input {...register("doctor_name", { required: "Doctor name is required" })} className="input input-bordered w-full" placeholder="e.g. Dr. Sharma (Ortho)" />
                                        {errors.doctor_name && <span className="text-error text-xs mt-1">{errors.doctor_name.message}</span>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-sm font-medium">Type of Surgery *</label>
                                        <select {...register("type_of_surgery")} className="select select-bordered w-full">
                                            <option value="General">General</option>
                                            <option value="Orthopedic">Orthopedic</option>
                                            <option value="Cardiac">Cardiac</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-sm font-medium">Estimated Cost (INR) *</label>
                                        <input type="number" {...register("estimated_cost", { required: true, valueAsNumber: true })} className="input input-bordered w-full" placeholder="₹" />
                                        {errors.estimated_cost && <span className="text-error text-xs mt-1">Cost is required</span>}
                                    </div>

                                    <div className="form-control col-span-1 md:col-span-2">
                                        <label className="label text-sm font-medium">Upload Estimate / Prescription (PDF/Image)</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="file"
                                                accept="image/*,application/pdf"
                                                onChange={handleFileUpload}
                                                className="file-input file-input-bordered w-full"
                                            />
                                            {isUploading && <span className="loading loading-spinner text-primary"></span>}
                                            {watch("file_url") && <span className="text-success"><FaCheckCircle /> Uploaded</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Financial Support */}
                        {step === 3 && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <FaRupeeSign className="text-primary" /> Financial Support Details
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="form-control">
                                        <label className="cursor-pointer label justify-start gap-4">
                                            <span className="label-text font-medium">Ayushman Card Available?</span>
                                            <input type="radio" value="YES" {...register("ayushmanCardAvailable")} className="radio radio-primary" /> Yes
                                            <input type="radio" value="NO" {...register("ayushmanCardAvailable")} className="radio radio-primary" /> No
                                        </label>
                                    </div>

                                    <div className="form-control">
                                        <label className="cursor-pointer label justify-start gap-4">
                                            <span className="label-text font-medium">Previous Assistance Received?</span>
                                            <input type="checkbox" {...register("previous_assistance")} className="checkbox checkbox-primary" />
                                            <span className="label-text">Yes</span>
                                        </label>
                                    </div>

                                    <div className="form-control">
                                        <label className="cursor-pointer label justify-start gap-4">
                                            <span className="label-text font-medium">Any NGO Support?</span>
                                            <input type="checkbox" {...register("ngo_support")} className="checkbox checkbox-primary" />
                                            <span className="label-text">Yes</span>
                                        </label>
                                    </div>

                                    <div className="form-control mt-4">
                                        <label className="label text-sm font-medium">Monthly Family Income (Approx)</label>
                                        <input type="number" {...register("monthly_income", { valueAsNumber: true })} className="input input-bordered w-full max-w-xs" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: Emergency Contact */}
                        {step === 4 && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <FaPhoneAlt className="text-primary" /> Emergency Contact
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="form-control">
                                        <label className="label text-sm font-medium">Guardian / Contact Name *</label>
                                        <input {...register("guardian_name", { required: "Guardian name is required" })} className="input input-bordered w-full" />
                                        {errors.guardian_name && <span className="text-error text-xs mt-1">{errors.guardian_name.message}</span>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-sm font-medium">Relation *</label>
                                        <input {...register("guardian_relation", { required: "Relation is required" })} className="input input-bordered w-full" placeholder="e.g. Father, Brother" />
                                        {errors.guardian_relation && <span className="text-error text-xs mt-1">{errors.guardian_relation.message}</span>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-sm font-medium">Guardian Mobile Number *</label>
                                        <input type="tel" {...register("guardian_number", { required: "Number is required", pattern: { value: /^[0-9]{10}$/, message: "Invalid mobile" } })} className="input input-bordered w-full" />
                                        {errors.guardian_number && <span className="text-error text-xs mt-1">{errors.guardian_number.message}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: Submit */}
                        {step === 5 && (
                            <div className="animate-fade-in-up text-center">
                                <h2 className="text-xl font-semibold mb-6 flex justify-center items-center gap-2">
                                    <FaCheckCircle className="text-primary" /> Final Declaration
                                </h2>

                                <div className="card bg-base-100 shadow-sm border border-gray-200 mb-6">
                                    <div className="card-body text-left">
                                        <h3 className="font-bold text-lg mb-2">Summary</h3>
                                        <p><strong>Patient:</strong> {watch("patient_name")}</p>
                                        <p><strong>Surgery:</strong> {watch("type_of_surgery")} at {watch("hospital_name")}</p>
                                        <p><strong>Cost:</strong> ₹{watch("estimated_cost")}</p>
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="cursor-pointer label justify-center gap-4">
                                        <input
                                            type="checkbox"
                                            {...register("is_terms_accepted", { required: true })}
                                            className="checkbox checkbox-primary checkbox-lg"
                                        />
                                        <span className="label-text text-lg">I declare that the information provided is correct.</span>
                                    </label>
                                    {errors.is_terms_accepted && <span className="text-error mt-2">You must accept the declaration to submit.</span>}
                                </div>

                                <div className="mt-8">
                                    <button
                                        type="submit"
                                        className={`btn btn-primary btn-wide btn-lg ${createMutation.isPending ? 'loading' : ''}`}
                                        disabled={createMutation.isPending}
                                    >
                                        Submit Application
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-4 border-t">
                            {step > 1 ? (
                                <button type="button" onClick={prevStep} className="btn btn-outline">Back</button>
                            ) : <div></div>}

                            {step < 5 && (
                                <button type="button" onClick={nextStep} className="btn btn-primary px-8">Next Step</button>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default SurgerySupportForm;
