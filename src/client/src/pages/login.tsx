import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import loginBackground from "../assets/login-background.png";
import TextInput from "../components/FormElements/TextInput";

type LoginType = "email" | "phone";

interface EmailLoginFormData {
  email: string;
  password: string;
}

interface PhoneLoginFormData {
  phone: string;
}

export default function Login() {
  const [loginType, setLoginType] = useState<LoginType>("email");

  const emailForm = useForm<EmailLoginFormData>({
    mode: "onChange",
  });

  const phoneForm = useForm<PhoneLoginFormData>({
    mode: "onChange",
  });

  const onEmailSubmit = (data: EmailLoginFormData) => {
    console.log("Email login:", data);
    // Implement email login logic here
  };

  const onPhoneSubmit = (data: PhoneLoginFormData) => {
    console.log("Phone login:", data);
    // Implement phone OTP login logic here
  };

  return (
    <>
      <Helmet>
        <title>Login - Bonchi v3</title>
      </Helmet>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBackground})` }}
      >
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl mb-4">Login</h2>

            {/* Login Type Selector */}
            <div className="tabs tabs-boxed mb-4">
              <button
                className={`tab ${loginType === "email" ? "tab-active" : ""}`}
                onClick={() => setLoginType("email")}
              >
                Email
              </button>
              <button
                className={`tab ${loginType === "phone" ? "tab-active" : ""}`}
                onClick={() => setLoginType("phone")}
              >
                Phone
              </button>
            </div>

            {/* Email Login Form */}
            {loginType === "email" && (
              <form
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="space-y-4"
              >
                <TextInput
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  error={emailForm.formState.errors.email?.message}
                  {...emailForm.register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />

                <TextInput
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  error={emailForm.formState.errors.password?.message}
                  {...emailForm.register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={emailForm.formState.isSubmitting}
                >
                  {emailForm.formState.isSubmitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            )}

            {/* Phone Login Form */}
            {loginType === "phone" && (
              <form
                onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
                className="space-y-4"
              >
                <TextInput
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number"
                  error={phoneForm.formState.errors.phone?.message}
                  {...phoneForm.register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Invalid Indian phone number",
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
                  <span className="text-sm">
                    Enter 10-digit Indian mobile number
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={phoneForm.formState.isSubmitting}
                >
                  {phoneForm.formState.isSubmitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            )}

            <div className="divider"></div>

            <div className="text-center">
              <Link to="/register" className="link link-primary">
                Don't have an account? Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
