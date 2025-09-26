import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center w-full h-full">
      <div className="relative w-14 h-14">
        {/* Background faded ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>

        {/* Gradient spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-b-transparent border-r-transparent border-blue-500 animate-spin"></div>

        {/* Inner pulse dot */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
