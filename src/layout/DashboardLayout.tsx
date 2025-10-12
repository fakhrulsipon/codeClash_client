import { use, useState } from "react";
import { Link, Outlet } from "react-router";
import { FiMenu } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../provider/AuthProvider";
import useUserRole from "../hook/useUserRole";
import LoadingSpinner from "../components/LoadingSpinner";
import { Home } from "lucide-react";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = use(AuthContext)!;
  const email = user?.email ?? user?.providerData?.[0]?.email;
  const { userRole, roleLoading } = useUserRole(email!);

  if (roleLoading) {
    return <LoadingSpinner />;
  }

  const links = (
    <>
      {userRole === "user" && (
        <>
          <a href="/dashboard" className="px-4 py-2 rounded hover:bg-blue-100">
            Home
          </a>
          <a
            href="/dashboard/manageContests"
            className="px-4 py-2 rounded hover:bg-blue-100"
          >
            Manage Contests
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
      )}

      {/* admin route */}
      {userRole === "admin" && (
        <>
          <a
            href="/dashboard/addContest"
            className="px-4 py-2 rounded hover:bg-blue-100"
          >
            Add Contest
          </a>

          <a
            href="/dashboard/manage-users"
            className="px-4 py-2 rounded hover:bg-blue-100"
          >
            Manage Users
          </a>
        </>
      )}
    </>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
    

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 h-screen bg-white fixed top-0 left-0 shadow-md">
          {/* 🔹 Go To Home Button */}
          <Link
            to="/"
            className="m-6 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg px-5 py-3 rounded-2xl shadow-lg hover:from-indigo-600 hover:to-blue-500 hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Go To Home
          </Link>
          <nav className="flex flex-col gap-2 p-4">{links}</nav>
        </aside>

        {/* Mobile & Tablet Drawer Sidebar */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />

              {/* Sliding aside */}
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
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Mobile Navbar with Hamburger */}
          <div className="flex items-center justify-between lg:hidden p-4">
            <button className="text-2xl" onClick={() => setIsOpen(true)}>
              <FiMenu />
            </button>
          </div>

          {/* Outlet for nested routes */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
