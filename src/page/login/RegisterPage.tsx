import * as React from "react";
import { Link as RouterLink } from "react-router";
import { FaLock } from "react-icons/fa";

const RegisterPage: React.FC = () => {
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

          <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>

          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              required
              className="mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              required
              className="mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              required
              className="mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              required
              className="mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Profile Image Upload */}
            <label className="mb-2 w-full">
              <span className="block text-center border px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                Upload Profile Picture
              </span>
              <input type="file" hidden accept="image/*" />
            </label>
            {/* Sign Up Button */}
            <button
              type="submit"
              className="mt-2 mb-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign Up
            </button>
            {/* Link to Login */}
            <div className="flex justify-center mt-2">
              <RouterLink
                to="/login"
                className="text-blue-500 hover:underline text-sm"
              >
                Already have an account? Sign In
              </RouterLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
