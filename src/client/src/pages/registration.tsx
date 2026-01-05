import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import cookies from "js-cookie";
import Logo from "./../assets/logo.png";
import loginBackground from "../assets/login-background.png";
import TextInput from "../components/FormElements/TextInput";
import { useRegisterUserMutation } from "../hooks/mutations";
import { toast } from "react-toastify";

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  password: string;
  confirm_password: string;
}

export default function Register() {
  // Mutations
  const createUserMutation = useRegisterUserMutation();
  const form = useForm<RegisterFormData>({
    mode: "onChange",
  });

  const onSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirm_password) {
      form.setError("confirm_password", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    console.log("Registration:", data);
    createUserMutation.mutate(data, {
      onSuccess: (response) => {
        console.log("User registered successfully:", response.data);
        cookies.set("AUTH_TOKEN", response.data.data?.token);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Registration failed");
        console.log("Error registering user:", error);
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Register - Bonchi Cares</title>
      </Helmet>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8"
        style={{ backgroundImage: `url(${loginBackground})` }}
      >
        <div className="w-full max-w-md">
          <div className="card bg-white shadow-2xl">
            <div className="card-body p-8">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <img src={Logo} alt="Bonchi Cares Logo" className="w-16 h-16" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
                Bonchi Cares
              </h2>
              <h3 className="text-xl font-semibold text-center text-gray-700 mb-1">
                Create Account
              </h3>
              <p className="text-center text-gray-500 text-sm mb-6">
                Register to get your health card
              </p>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* First Name and Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="First Name"
                    type="text"
                    placeholder="First name"
                    error={form.formState.errors.first_name?.message}
                    {...form.register("first_name", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                  />

                  <TextInput
                    label="Last Name"
                    type="text"
                    placeholder="Last name"
                    error={form.formState.errors.last_name?.message}
                    {...form.register("last_name", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                  />
                </div>

                {/* Email Address */}
                <TextInput
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  error={form.formState.errors.email?.message}
                  {...form.register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />

                {/* Phone Number */}
                <TextInput
                  label="Phone Number"
                  type="tel"
                  placeholder="10 digit mobile number"
                  error={form.formState.errors.mobile?.message}
                  {...form.register("mobile", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Invalid Indian mobile number",
                    },
                  })}
                />

                {/* Password and Confirm Password */}
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    error={form.formState.errors.password?.message}
                    {...form.register("password", {
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
                    placeholder="Re-enter password"
                    error={form.formState.errors.confirm_password?.message}
                    {...form.register("confirm_password", {
                      required: "Please confirm your password",
                    })}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn w-full text-white font-semibold rounded-lg py-3"
                  style={{ backgroundColor: "#E87835" }}
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="text-center mt-6">
                <span className="text-gray-600 text-sm">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
