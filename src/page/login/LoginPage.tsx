import * as React from "react";
import { Link as RouterLink } from "react-router";
import { FaLock } from "react-icons/fa";

const LoginPage: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              required
              autoFocus
              className="mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              required
              className="mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Sign In Button */}
            <button
              type="submit"
              className="mt-3 mb-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign In
            </button>

            {/* Links stacked vertically */}
            <div className="flex flex-col items-center mt-2 space-y-1">
              <RouterLink
                to="/forgot-password"
                className="text-blue-500 text-sm hover:underline"
              >
                Forgot password?
              </RouterLink>
              <RouterLink
                to="/register"
                className="text-blue-500 text-sm hover:underline"
              >
                Don&apos;t have an account? Sign Up
              </RouterLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
