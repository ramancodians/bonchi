import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import loginBackground from "../assets/login-background.png";
import Logo from "./../assets/logo.png";
import TextInput from "../components/FormElements/TextInput";
import { useLoginMutation } from "../hooks/mutations";
import { setAuthToken } from "../utils/cookies";
import { toast } from "react-toastify";
import { getDashboardPath } from "../utils/roleUtils";

interface LoginFormData {
  emailOrPhone: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<LoginFormData>({
    mode: "onChange",
  });

  const loginMutation = useLoginMutation();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      const { token, user } = response.data.data;

      // Save token to cookies
      setAuthToken(token);

      // Show success message
      toast.success(`Welcome back, ${user.first_name}!`);

      // Redirect based on role
      const dashboardPath = getDashboardPath(user.role);
      navigate(dashboardPath);
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
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
            <img
              src={Logo}
              alt="Bonchi Cares"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h2 className="card-title justify-center text-2xl mb-4">Login</h2>

            {/* Email/Phone Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextInput
                label="Email or Phone"
                type="text"
                placeholder="Enter your email or phone number"
                error={formState.errors.emailOrPhone?.message}
                {...register("emailOrPhone", {
                  required: "Email or phone number is required",
                  validate: (value) => {
                    const isEmail =
                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
                    const isPhone = /^[6-9]\d{9}$/.test(value);
                    return (
                      isEmail ||
                      isPhone ||
                      "Please enter a valid email or 10-digit phone number"
                    );
                  },
                })}
              />

              <TextInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={formState.errors.password?.message}
                {...register("password", {
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
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="divider"></div>

            <div className="text-center flex flex-col">
              <Link to="/register" className="link link-primary">
                Don't have an account? Register
              </Link>
              <Link to="/register-partner" className="link link-primary">
                Register as Partner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
