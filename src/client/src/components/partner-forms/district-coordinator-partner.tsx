import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../FormElements/TextInput";
import { useCreatePartnerMutation } from "../../hooks/mutations";
import { State, City } from "country-state-city";

interface DistrictCoordinatorFormData {
    first_name: string;
    last_name: string;
    mobile: string;
    email: string; // Required for official comms
    password: string;
    confirm_password: string;

    district: string;
    employee_id?: string;
}

const DistrictCoordinatorForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
        setValue
    } = useForm<DistrictCoordinatorFormData>();

    const { mutate: createPartner, isPending } = useCreatePartnerMutation();
    const password = watch("password");

    // State for address selection
    const [selectedStateIso, setSelectedStateIso] = useState<string>("");
    const states = State.getStatesOfCountry("IN");
    const districts = selectedStateIso ? City.getCitiesOfState("IN", selectedStateIso) : [];

    const onSubmit = async (data: DistrictCoordinatorFormData) => {
        // Prepare payload correctly
        const payload = {
            ...data,
            role: "DISTRICT_CORDINATOR",
            assigned_districts: [data.district] // Assign home district by default
        };

        createPartner(payload, {
            onSuccess: () => {
                alert("District Manager created successfully!");
                reset({
                    first_name: "",
                    last_name: "",
                    mobile: "",
                    email: "",
                    password: "",
                    confirm_password: "",
                    district: "",
                    employee_id: ""
                });
                setSelectedStateIso("");
            },
            onError: (error: any) => {
                console.error("Error creating DM:", error);
                alert(error?.response?.data?.message || "Failed to create District Manager");
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">District Manager Registration</h2>
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
                        label="Email (Required)"
                        type="email"
                        placeholder="Official Email"
                        error={errors.email?.message}
                        {...register("email", { required: "Email required" })}
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

            <div className="pb-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">Jurisdiction Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Select State</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={selectedStateIso}
                            onChange={(e) => {
                                setSelectedStateIso(e.target.value);
                                setValue("district", ""); // Reset district when state changes
                            }}
                        >
                            <option value="">-- Select State --</option>
                            {states.map((state) => (
                                <option key={state.isoCode} value={state.isoCode}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Select District</span>
                        </label>
                        <select
                            className={`select select-bordered w-full ${errors.district ? "select-error" : ""}`}
                            {...register("district", { required: "District assignment is required" })}
                            disabled={!selectedStateIso}
                        >
                            <option value="">-- Select District --</option>
                            {districts.map((city) => (
                                <option key={city.name} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        {errors.district && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.district.message}</span>
                            </label>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" className="btn btn-outline" onClick={() => window.history.back()}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || isPending}>
                    {isSubmitting || isPending ? <span className="loading loading-spinner"></span> : "Create District Manager"}
                </button>
            </div>
        </form>
    );
};

export default DistrictCoordinatorForm;
