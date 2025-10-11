import React from "react";
import { Link } from "react-router";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-100 p-6 relative overflow-hidden">
      {/* Animated gradient blobs */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror" }}
        className="pointer-events-none absolute -z-10 inset-0 flex items-end justify-start"
      >
        <div className="w-72 h-72 rounded-full bg-pink-300 blur-3xl mix-blend-multiply transform -translate-x-24 translate-y-24" />
        <div className="w-96 h-96 rounded-full bg-indigo-300 blur-3xl mix-blend-multiply transform translate-x-48 -translate-y-12" />
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-3xl w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        <div className="md:flex">
          {/* Left visual section */}
          <div className="md:w-1/2 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
            <div className="p-4 rounded-full bg-white/10 mb-6 shadow-lg">
              <Lock className="w-16 h-16" />
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight mb-2">
              403
            </h1>
            <p className="text-lg opacity-90 text-center px-4">
              Forbidden — Access Denied
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-3 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-indigo-50 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 3.293l6 6V17a1 1 0 01-1 1h-3v-4H8v4H5a1 1 0 01-1-1V9.293l6-6z" />
                </svg>
                Go To Home
              </Link>
            </motion.div>
          </div>

          {/* Right content section */}
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Access Forbidden
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              You don’t have permission to access this page. This might happen
              if you don’t have the correct role or privileges. Please contact
              the administrator if you believe this is a mistake.
            </p>

            <ul className="text-gray-600 space-y-2 mb-6 list-disc list-inside">
              <li>Ensure you are logged in with the correct account</li>
              <li>Request permission from the site administrator</li>
              <li>Try refreshing the page or logging in again</li>
            </ul>

            <div className="flex gap-3">
              <Link
                to="/"
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all"
              >
                Go To Home
              </Link>

              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all"
              >
                Reload Page
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-400">
              If you think this is an error, please contact support@example.com
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForbiddenPage;
