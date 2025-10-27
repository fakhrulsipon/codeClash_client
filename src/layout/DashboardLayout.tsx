import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  FiMenu,
  FiUser,
  FiLogOut,
  FiChevronRight,
  FiHome,
} from "react-icons/fi";
import {
  FaUsers,
  FaPlus,
  FaList,
  FaHistory,
  FaUserShield,
  FaUserFriends,
  FaUserCheck,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../provider/AuthProvider";
import useUserRole from "../hook/useUserRole";
import LoadingSpinner from "../components/LoadingSpinner";
import { useContext } from "react";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext)!;
  const location = useLocation();
  const email = user?.email ?? user?.providerData?.[0]?.email;
  const { userRole, roleLoading } = useUserRole(email!);

  if (roleLoading) {
    return <LoadingSpinner />;
  }

  // User-specific links
  const userLinks = [
    {
      path: "/dashboard/profile",
      label: "Profile",
      icon: <FiUser className="w-5 h-5" />,
    },
    {
      path: "/dashboard/history",
      label: "History",
      icon: <FaHistory className="w-5 h-5" />,
    },
  ];

  // Admin-specific links
  const adminLinks = [
    {
      path: "/dashboard/addProblem",
      label: "Add Problem",
      icon: <FaPlus className="w-5 h-5" />,
    },
    {
      path: "/dashboard/addContest",
      label: "Add Contest",
      icon: <FaPlus className="w-5 h-5" />,
    },
    {
      path: "/dashboard/manageContests",
      label: "Manage Contests",
      icon: <FaList className="w-5 h-5" />,
    },
    {
      path: "/dashboard/manage-users",
      label: "Manage Users",
      icon: <FaUsers className="w-5 h-5" />,
    },
    {
      path: "/dashboard/manageTeams",
      label: "Manage Teams",
      icon: <FaUserFriends className="w-5 h-5" />,
    },
    {
      path: "/dashboard/manageParticipants",
      label: "Manage Participants",
      icon: <FaUserCheck className="w-5 h-5" />,
    },
  ];

  const allLinks = [
    ...(userRole === "admin" ? adminLinks : []),
    ...(userRole === "user" ? userLinks : []),
  ];

  const isActiveLink = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const NavLink = ({
    path,
    label,
    icon,
  }: {
    path: string;
    label: string;
    icon: React.ReactNode;
  }) => (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border ${
        isActiveLink(path)
          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg border-cyan-400/50"
          : "text-gray-300 hover:bg-white/10 hover:text-white border-white/10 hover:border-white/20"
      }`}
      onClick={() => setIsOpen(false)}
    >
      <span
        className={`${isActiveLink(path) ? "text-white" : "text-gray-400 group-hover:text-cyan-300"}`}
      >
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      <FiChevronRight
        className={`ml-auto transition-transform duration-200 ${
          isActiveLink(path) ? "rotate-90 text-white" : "text-gray-400 group-hover:text-cyan-300 group-hover:translate-x-1"
        }`}
      />
    </Link>
  );

  const LogoutButton = () => (
    <button
      onClick={() => {
        // Handle logout logic here
        window.location.href = "/dashboard/logout";
      }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 transition-all duration-200 group mt-auto"
    >
      <FiLogOut className="w-5 h-5" />
      <span className="font-medium">Logout</span>
    </button>
  );

  const UserInfo = () => (
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center gap-3">
        {/* User Photo */}
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/50"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg border-2 border-cyan-400/50">
            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
        )}

        {/* User Details */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {user?.displayName || "User"}
          </p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          <div className="flex items-center gap-1 mt-1">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                userRole === "admin"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
              }`}
            >
              {userRole === "admin" && <FaUserShield className="w-3 h-3" />}
              {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-80 h-screen bg-gradient-to-b from-slate-800/90 to-slate-900/90 fixed top-0 left-0 shadow-2xl border-r border-white/10 backdrop-blur-xl">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CodeClash Dashboard
            </h1>
          </div>

          {/* User Info */}
          <div className="shrink-0">
            <UserInfo />
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2 p-4">
              {allLinks.map((link) => (
                <NavLink key={link.path} {...link} />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 p-4 border-t border-white/10 space-y-3">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:from-cyan-600 hover:to-blue-500 hover:scale-105 transition-all duration-300 border border-cyan-400/50"
            >
              <FiHome className="w-4 h-4" />
              Go To Home
            </Link>
            <LogoutButton />
          </div>
        </aside>

        {/* Mobile & Tablet Drawer Sidebar */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />

              {/* Sliding aside - FIXED SCROLL */}
              <motion.aside
                className="fixed left-0 top-0 w-80 h-full bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl z-50 lg:hidden flex flex-col border-r border-white/10"
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                {/* Header - Fixed */}
                <div className="shrink-0 flex justify-between items-center p-6 border-b border-white/10 bg-slate-800">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <button
                    className="text-gray-400 hover:text-white text-xl font-bold hover:scale-110 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                {/* User Info - Fixed */}
                <div className="shrink-0">
                  <UserInfo />
                </div>

                {/* Navigation - Scrollable */}
                <nav className="flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-2 p-4">
                    {allLinks.map((link) => (
                      <NavLink key={link.path} {...link} />
                    ))}
                  </div>
                </nav>

                {/* Footer - Fixed */}
                <div className="shrink-0 p-4 border-t border-white/10 bg-slate-800 space-y-3">
                  <Link
                    to="/"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:from-cyan-600 hover:to-blue-500 transition-all duration-300 border border-cyan-400/50"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiHome className="w-4 h-4" />
                    Go To Home
                  </Link>
                  <LogoutButton />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:ml-80">
          {/* Mobile Navbar */}
          <div className="lg:hidden bg-slate-800/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
            <div className="flex items-center justify-between p-4">
              <button
                className="text-2xl text-cyan-400 hover:text-cyan-300 transition-colors duration-200 hover:scale-110"
                onClick={() => setIsOpen(true)}
              >
                <FiMenu />
              </button>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold border border-cyan-400/50">
                {user?.displayName?.[0] ||
                  user?.email?.[0]?.toUpperCase() ||
                  "U"}
              </div>
            </div>
          </div>

          {/* Outlet for nested routes */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {/* Background Elements */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}