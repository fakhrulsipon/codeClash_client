import { useState } from "react";
import { Outlet } from "react-router";
import { FiMenu } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DashboardNavbar from "../page/dashboard/dashboardNavbar/DashboardNavbar";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const links = (
    <>
      <a href="/dashboard" className="px-4 py-2 rounded hover:bg-blue-100">
        Home
      </a>
      <a
        href="/dashboard/addContest"
        className="px-4 py-2 rounded hover:bg-blue-100"
      >
        Add Contest
      </a>
      <a
        href="/dashboard/profile"
        className="px-4 py-2 rounded hover:bg-blue-100"
      >
        Profile
      </a>
      <a
        href="/dashboard/settings"
        className="px-4 py-2 rounded hover:bg-blue-100"
      >
        Settings
      </a>
      <a
        href="/dashboard/logout"
        className="px-4 py-2 rounded hover:bg-red-100 text-red-600"
      >
        Logout
      </a>
    </>
  );

  return (
    <div className=" bg-gray-100">
      {/* Navbar for desktop */}
      <div className="pb-5">
        <DashboardNavbar />
      </div>
      <div className="flex">
        {/* Sidebar for desktop only (lg↑) */}
        <aside className="hidden lg:flex flex-col w-64 h-screen bg-white fixed top-0 left-0 shadow-md">
          <div className="p-6 text-2xl font-bold text-blue-600">Dashboard</div>
          <nav className="flex flex-col gap-2 p-4">{links}</nav>
        </aside>

        {/* Mobile & Tablet drawer sidebar with animation */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />

              {/* sliding aside */}
              <motion.aside
                className="fixed left-0 top-0 w-64 h-full bg-white shadow-md p-6 z-50 lg:hidden"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6 lg:mt-0 mt-15">
                  <span className="text-2xl font-bold text-blue-600">
                    Dashboard
                  </span>
                  {/* Close button always visible */}
                  <button
                    className="text-gray-600 text-2xl font-bold hover:text-red-500"
                    onClick={() => setIsOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                <nav className="flex flex-col gap-2">{links}</nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Navbar with hamburger (mobile & tablet) */}
          <div className="flex items-center justify-between lg:hidden p-4">
            <button className="text-2xl" onClick={() => setIsOpen(true)}>
              <FiMenu />
            </button>
            {/* <span className="font-bold text-xl">Dashboard</span> */}
          </div>

          {/* Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
