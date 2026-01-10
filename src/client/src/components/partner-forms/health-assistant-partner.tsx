
import React from "react";
import { useForm } from "react-hook-form";
import TextInput from "../FormElements/TextInput";
import { useCreatePartnerMutation } from "../../hooks/mutations";

interface HealthAssistantFormData {
    // User Credentials
    first_name: string;
    last_name: string;
    mobile: string;
    password: string;
    confirm_password: string;
    email?: string;

    // Professional Details
    profession: string;
    qualification: string;
    specialization?: string;
    experience_years?: number;
    aadhaar_number?: string;

    // Address
    address?: string;
}

const HealthAssistantForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm<HealthAssistantFormData>({
        defaultValues: {
            profession: "Heath Assistant"
        }
    });

    const { mutate: createPartner, isPending } = useCreatePartnerMutation();
    const password = watch("password");

    const onSubmit = async (data: HealthAssistantFormData) => {
        const payload = {
            ...data,
            role: "HEALTH_ASSISTANT",
        };

        createPartner(payload, {
            onSuccess: () => {
                alert("Health Assistant created successfully!");
                reset();
            },
            onError: (error: any) => {
                console.error("Error creating health assistant:", error);
                alert(error?.response?.data?.message || "Failed to create health assistant");
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Login Credentials Section */}
            <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">Login Credentials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                        label="First Name"
                        placeholder="First Name"
                        error={errors.first_name?.message}
                        {...register("first_name", { required: "First name required" })}
                    />
                    <TextInput
                        label="Last Name"
                        placeholder="Last Name"
                        error={errors.last_name?.message}
                        {...register("last_name", { required: "Last name required" })}
                    />
                    <TextInput
                        label="Mobile Number"
                        type="tel"
                        placeholder="10-digit mobile"
                        error={errors.mobile?.message}
                        {...register("mobile", { required: "Mobile required", pattern: { value: /^[6-9]\d{9}$/, message: "Invalid mobile" } })}
                    />
                    <TextInput
                        label="Email (Optional)"
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                    />
                    <TextInput
                        label="Password"
                        type="password"
                        placeholder="Password"
                        error={errors.password?.message}
                        {...register("password", { required: "Password required", minLength: { value: 6, message: "Min 6 chars" } })}
                    />
                    <TextInput
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm Password"
                        error={errors.confirm_password?.message}
                        {...register("confirm_password", { required: "Confirm password", validate: v => v === password || "Passwords mismatch" })}
                    />
                </div>
            </div>

            {/* Professional Details */}
            <div className="pb-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">Professional Details</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                            label="Profession / Role"
                            placeholder="e.g. Nurse, Compounder"
                            error={errors.profession?.message}
                            {...register("profession", { required: "Profession required" })}
                        />
                        <TextInput
                            label="Qualification"
                            placeholder="e.g. B.Sc Nursing, Diploma"
                            error={errors.qualification?.message}
                            {...register("qualification", { required: "Qualification required" })}
                        />
                        <TextInput
                            label="Specialization (Optional)"
                            placeholder="e.g. Critical Care"
                            {...register("specialization")}
                        />
                        <TextInput
                            label="Experience (Years)"
                            type="number"
                            placeholder="e.g. 5"
                            {...register("experience_years")}
                        />
                        <TextInput
                            label="Aadhaar Number"
                            placeholder="12-digit Aadhaar"
                            {...register("aadhaar_number", { pattern: { value: /^\d{12}$/, message: "Invalid Aadhaar" } })}
                        />
                        <TextInput
                            label="Full Address"
                            placeholder="Current Address"
                            {...register("address")}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" className="btn btn-outline" onClick={() => window.history.back()}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || isPending}>
                    {isSubmitting || isPending ? <span className="loading loading-spinner"></span> : "Create Health Assistant"}
                </button>
            </div>
        </form>
    );
};

export default HealthAssistantForm;
