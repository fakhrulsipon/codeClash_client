import { use, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { FiMenu, FiUser, FiLogOut, FiChevronRight } from "react-icons/fi";
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
import useUserRole from "../hook/useUserRole";
import LoadingSpinner from "../components/LoadingSpinner";
import { Home } from "lucide-react";
import { AuthContext } from "../provider/AuthProvider";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = use(AuthContext)!;
  const location = useLocation();
  const email = user?.email ?? user?.providerData?.[0]?.email;
  const { userRole, roleLoading } = useUserRole(email!);
  console.log(userRole);

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
    {
      path: "/dashboard/leaderboard",
      label: "Leaderboard",
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
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActiveLink(path)
          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
      }`}
      onClick={() => setIsOpen(false)}
    >
      <span
        className={`${isActiveLink(path) ? "text-white" : "text-gray-500 group-hover:text-blue-600"}`}
      >
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      <FiChevronRight
        className={`ml-auto transition-transform duration-200 ${
          isActiveLink(path) ? "rotate-90" : "group-hover:translate-x-1"
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
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group mt-auto"
    >
      <FiLogOut className="w-5 h-5" />
      <span className="font-medium">Logout</span>
    </button>
  );

  const UserInfo = () => (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        {/* User Photo */}
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
            referrerPolicy="no-referrer" // Important for Google/Facebook images
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
        )}

        {/* User Details */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {user?.displayName || "User"}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          <div className="flex items-center gap-1 mt-1">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                userRole === "admin"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {userRole === "admin" && <FaUserShield className="w-3 h-3" />}
              {userRole
                ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
                : "User"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 h-screen bg-white fixed top-0 left-0 shadow-lg border-r border-gray-200">
          {/* User Info */}
          <div className="shrink-0">
            <UserInfo />
          </div>

          {/* Navigation - Simple scroll */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-1 p-4">
              {allLinks.map((link) => (
                <NavLink key={link.path} {...link} />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 p-4 border-t border-gray-200 space-y-3">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:from-indigo-600 hover:to-blue-500 hover:scale-105 transition-all duration-300"
            >
              <Home className="w-4 h-4" />
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
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />

              {/* Sliding aside */}
              <motion.aside
                className="fixed left-0 top-0 w-80 h-full bg-white shadow-xl z-50 lg:hidden flex flex-col"
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <button
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold hover:scale-110 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                {/* User Info */}
                <UserInfo />

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-1 p-4">
                  {allLinks.map((link) => (
                    <NavLink key={link.path} {...link} />
                  ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <Link
                    to="/"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:from-indigo-600 hover:to-blue-500 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="w-4 h-4" />
                    Go To Home
                  </Link>
                  <LogoutButton />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Mobile Navbar */}
          <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between p-4">
              <button
                className="text-2xl text-gray-600 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsOpen(true)}
              >
                <FiMenu />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.displayName?.[0] ||
                  user?.email?.[0]?.toUpperCase() ||
                  "U"}
              </div>
            </div>
          </div>

          {/* Outlet for nested routes */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
