import { Link } from "react-router";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { use, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {loginUser} = use(AuthContext)!;
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = (data: LoginFormInputs) => {
    loginUser(data.email, data.password)
    .then((res) => {
      console.log('succssull login', res.user)
    })
    .catch((err) => {
      console.log("error", err.message)
    })
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xs">
        <div className="flex flex-col items-center">
          {/* Lock Icon */}
          <div className="bg-blue-500 rounded-full p-4 mb-4">
            <FaLock className="text-white text-2xl" />
          </div>

          <h1 className="text-2xl font-semibold mb-4">Login</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col">
            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              autoFocus
              {...register("email", { required: "Email is required" })}
              className="mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

            {/* Password with Eye Toggle */}
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

            {/* Sign In Button */}
            <button
              type="submit"
              className="mt-3 mb-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign In
            </button>

            {/* Links stacked vertically */}
            <div className="flex flex-col items-center mt-2 space-y-1">
              <Link
                to="/forgot-password"
                className="text-blue-500 text-sm hover:underline"
              >
                Forgot password?
              </Link>
              <Link
                to="/register"
                className="text-blue-500 text-sm hover:underline"
              >
                Don&apos;t have an account? Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
