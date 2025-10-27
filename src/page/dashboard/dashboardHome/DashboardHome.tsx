import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiPlus, FiUsers, FiAlertTriangle, FiCheckCircle, FiClock, FiBarChart2, FiTrendingUp, FiActivity, FiCode, FiAward, FiAlertCircle } from "react-icons/fi";
import { FaCode, FaUserCheck, FaChartLine, FaDatabase, FaUserFriends, FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router";
import useAxiosSecure from "../../../hook/useAxiosSecure";

interface DashboardStats {
  totalUsers: number;
  totalProblems: number;
  totalContests: number;
  totalTeams: number;
  submissionsToday: number;
  acceptanceRate: number;
  activeUsers: number;
  pendingReviews: number;
  avgSolveTime: string;
  topLanguage: string;
  recentSubmissions: Submission[];
  userGrowth: number;
  submissionGrowth: number;
  debug?: any;
}

interface Submission {
  _id: string;
  userId: string;
  userName: string;
  problemId: string;
  problemName: string;
  language: string;
  result: string;
  submittedAt: string;
}

interface QuickAction {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  color: string;
}

export const AdminDashboardHome: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const axiosSecure = useAxiosSecure();

  const quickActions: QuickAction[] = [
    {
      label: "Manage Problems",
      path: "/dashboard/manageProblems",
      icon: FaCode,
      color: "blue"
    },
    {
      label: "Manage Users",
      path: "/dashboard/manage-users",
      icon: FiUsers,
      color: "cyan"
    },
    {
      label: "Manage Contests",
      path: "/dashboard/manageContests",
      icon: FaTrophy,
      color: "purple"
    },
    {
      label: "Manage Teams",
      path: "/dashboard/manageTeams",
      icon: FaUserFriends,
      color: "green"
    },
    {
      label: "Create Problem",
      path: "/dashboard/addProblem",
      icon: FiPlus,
      color: "yellow"
    },
    {
      label: "Create Contest",
      path: "/dashboard/addContest",
      icon: FiAward,
      color: "red"
    }
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching dashboard data...");
      
      const response = await axiosSecure.get("/api/admin/dashboard");
      console.log("✅ Dashboard data received:", response.data);
      setStats(response.data);
    } catch (error: any) {
      console.error("❌ Error fetching dashboard data:", error);
      setError(error.response?.data?.message || "Failed to load dashboard data");
      
      // Fallback to empty state
      setStats({
        totalUsers: 0,
        totalProblems: 0,
        totalContests: 0,
        totalTeams: 0,
        submissionsToday: 0,
        acceptanceRate: 0,
        activeUsers: 0,
        pendingReviews: 0,
        avgSolveTime: "0m 0s",
        topLanguage: "N/A",
        recentSubmissions: [],
        userGrowth: 0,
        submissionGrowth: 0
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "green": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "purple": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "cyan": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "red": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "yellow": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getDeltaColor = (value: number) => {
    if (value > 0) return "text-green-400";
    if (value < 0) return "text-red-400";
    return "text-gray-400";
  };

  const formatDelta = (value: number) => {
    if (value > 0) return `+${value.toFixed(1)}%`;
    if (value < 0) return `${value.toFixed(1)}%`;
    return "—";
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">
              Real-time overview of platform statistics and activities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white hover:bg-slate-600/50 transition-all duration-200 disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </motion.button>
            <Link to="/dashboard/addProblem">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-cyan-600 hover:to-blue-500 transition-all duration-200 border border-cyan-400/50"
              >
                <FiPlus className="w-4 h-4" />
                Create Problem
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3"
        >
          <FiAlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Error loading dashboard</p>
            <p className="text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Debug Info */}
      {stats?.debug && (
        <details className="mb-6 bg-slate-800/50 border border-white/10 rounded-xl p-4">
          <summary className="cursor-pointer text-sm text-gray-400">Debug Information</summary>
          <pre className="mt-2 text-xs text-gray-500 overflow-auto">
            {JSON.stringify(stats.debug, null, 2)}
          </pre>
        </details>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4 mb-8">
        {/* Total Users */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-white/10 rounded-xl p-4 lg:p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-400">Total Users</p>
              <p className="text-xl lg:text-2xl font-bold text-blue-400 mt-1">
                {stats?.totalUsers?.toLocaleString() || "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">registered users</p>
            </div>
            <div className="p-2 lg:p-2 rounded-lg border bg-blue-500/20 border-blue-500/30">
              <FiUsers className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className={`text-xs font-medium ${getDeltaColor(stats?.userGrowth || 0)}`}>
              {formatDelta(stats?.userGrowth || 0)}
            </span>
            <div className="w-20 text-gray-500">
              <FiTrendingUp className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Total Problems */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 border border-white/10 rounded-xl p-4 lg:p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-400">Problems</p>
              <p className="text-xl lg:text-2xl font-bold text-green-400 mt-1">
                {stats?.totalProblems?.toLocaleString() || "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">available problems</p>
            </div>
            <div className="p-2 lg:p-2 rounded-lg border bg-green-500/20 border-green-500/30">
              <FaCode className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-medium text-gray-400">—</span>
            <div className="w-20 text-gray-500">
              <FaDatabase className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Submissions Today */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 border border-white/10 rounded-xl p-4 lg:p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-400">Submissions Today</p>
              <p className="text-xl lg:text-2xl font-bold text-purple-400 mt-1">
                {stats?.submissionsToday?.toLocaleString() || "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">24h period</p>
            </div>
            <div className="p-2 lg:p-2 rounded-lg border bg-purple-500/20 border-purple-500/30">
              <FaChartLine className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className={`text-xs font-medium ${getDeltaColor(stats?.submissionGrowth || 0)}`}>
              {formatDelta(stats?.submissionGrowth || 0)}
            </span>
            <div className="w-20 text-gray-500">
              <FiActivity className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Acceptance Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 border border-white/10 rounded-xl p-4 lg:p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-400">Acceptance Rate</p>
              <p className="text-xl lg:text-2xl font-bold text-cyan-400 mt-1">
                {stats?.acceptanceRate?.toFixed(1) || "0"}%
              </p>
              <p className="text-xs text-gray-500 mt-1">global average</p>
            </div>
            <div className="p-2 lg:p-2 rounded-lg border bg-cyan-500/20 border-cyan-500/30">
              <FaUserCheck className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-medium text-gray-400">—</span>
            <div className="w-20 text-gray-500">
              <FiBarChart2 className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Active Users */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 border border-white/10 rounded-xl p-4 lg:p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-400">Active Users</p>
              <p className="text-xl lg:text-2xl font-bold text-blue-400 mt-1">
                {stats?.activeUsers?.toLocaleString() || "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">last 1 hour</p>
            </div>
            <div className="p-2 lg:p-2 rounded-lg border bg-blue-500/20 border-blue-500/30">
              <FiUsers className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-medium text-gray-400">—</span>
            <div className="w-20 text-gray-500">
              <FiActivity className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Total Contests */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 border border-white/10 rounded-xl p-4 lg:p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-400">Total Contests</p>
              <p className="text-xl lg:text-2xl font-bold text-purple-400 mt-1">
                {stats?.totalContests?.toLocaleString() || "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">created contests</p>
            </div>
            <div className="p-2 lg:p-2 rounded-lg border bg-purple-500/20 border-purple-500/30">
              <FaTrophy className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-medium text-gray-400">—</span>
            <div className="w-20 text-gray-500">
              <FaTrophy className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Total Teams */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800/50 border border-white/10 rounded-xl p-4 lg:p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-400">Total Teams</p>
              <p className="text-xl lg:text-2xl font-bold text-green-400 mt-1">
                {stats?.totalTeams?.toLocaleString() || "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">registered teams</p>
            </div>
            <div className="p-2 lg:p-2 rounded-lg border bg-green-500/20 border-green-500/30">
              <FaUserFriends className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-medium text-gray-400">—</span>
            <div className="w-20 text-gray-500">
              <FaUserFriends className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Pending Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-slate-800/50 border border-white/10 rounded-xl p-4 lg:p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-400">Pending Reviews</p>
              <p className="text-xl lg:text-2xl font-bold text-yellow-400 mt-1">
                {stats?.pendingReviews?.toLocaleString() || "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">awaiting action</p>
            </div>
            <div className="p-2 lg:p-2 rounded-lg border bg-yellow-500/20 border-yellow-500/30">
              <FiAlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-medium text-gray-400">—</span>
            <div className="w-20 text-gray-500">
              <FiAlertTriangle className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rest of the component remains the same... */}
      {/* ... (keep the larger panels and recent submissions table from previous code) ... */}

    </motion.div>
  );
};

export default AdminDashboardHome;