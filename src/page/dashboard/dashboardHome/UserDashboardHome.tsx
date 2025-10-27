import React, { useState, useEffect } from "react";
import {
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiActivity,
  FiAward,
  FiStar,
} from "react-icons/fi";
import { FaCode, FaTrophy, FaUser, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, useOutletContext } from "react-router"; // Add useOutletContext
import useAxiosSecure from "../../../hook/useAxiosSecure";

interface UserStats {
  totalSolved: number;
  totalPoints: number;
  successRate: number;
  currentStreak: number;
  rank: number;
  recentSubmissions: UserSubmission[];
  favoriteLanguage: string;
  problemsSolvedToday: number;
}

interface UserSubmission {
  _id: string;
  problemId: string;
  problemName: string;
  difficulty: string;
  language: string;
  result: string;
  submittedAt: string;
  points: number;
}

interface QuickAction {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  color: string;
}

// Define the context type
interface DashboardContext {
  user: any; // You can replace 'any' with your User type
}

export const UserDashboardHome: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const axiosSecure = useAxiosSecure();

  // Get user from outlet context
  const { user } = useOutletContext<DashboardContext>();
  const email = user?.email || user?.providerData?.[0]?.email;

  const quickActions: QuickAction[] = [
    {
      label: "Solve Problems",
      path: "/problems",
      icon: FaCode,
      color: "blue",
    },
    {
      label: "Join Contest",
      path: "/contests",
      icon: FaTrophy,
      color: "purple",
    },
    {
      label: "View Leaderboard",
      path: "/leaderboard",
      icon: FiTrendingUp,
      color: "cyan",
    },
    {
      label: "My Submissions",
      path: "/history",
      icon: FiActivity,
      color: "green",
    },
    {
      label: "My Profile",
      path: "/profile",
      icon: FaUser,
      color: "yellow",
    },
  ];

  const fetchUserStats = async () => {
    // Don't fetch if no email
    if (!email) {
      setError("User email not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use the email parameter in the API call
      const response = await axiosSecure.get(`/api/users/dashboard/${email}`);
      setStats(response.data);
    } catch (error: any) {
      console.error("❌ Error fetching user stats:", error);
      setError(
        error.response?.data?.message || "Failed to load your dashboard data"
      );

      // Fallback to empty state
      setStats({
        totalSolved: 0,
        totalPoints: 0,
        successRate: 0,
        currentStreak: 0,
        rank: 0,
        recentSubmissions: [],
        favoriteLanguage: "N/A",
        problemsSolvedToday: 0,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserStats();
  };

  useEffect(() => {
    if (email) {
      fetchUserStats();
    }
  }, [email]);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "green":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "purple":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "cyan":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "yellow":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
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
              My Dashboard
            </h1>
            <p className="text-gray-400">
              Track your coding progress and achievements
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white hover:bg-slate-600/50 transition-all duration-200 disabled:opacity-50"
            >
              <FiRefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </motion.button>
            <Link to="/problems">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-500 transition-all duration-200 border border-cyan-400/50"
              >
                <FaCode className="w-4 h-4" />
                Solve Problems
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Stats Grid */}
        <div className="xl:col-span-2">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-8">
            {/* Total Solved */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Problems Solved
                  </p>
                  <p className="text-2xl font-bold text-green-400 mt-1">
                    {stats?.totalSolved || "0"}
                  </p>
                </div>
                <div className="p-2 rounded-lg border bg-green-500/20 border-green-500/30">
                  <FiCheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </motion.div>

            {/* Total Points */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Total Points
                  </p>
                  <p className="text-2xl font-bold text-yellow-400 mt-1">
                    {stats?.totalPoints || "0"}
                  </p>
                </div>
                <div className="p-2 rounded-lg border bg-yellow-500/20 border-yellow-500/30">
                  <FiStar className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </motion.div>

            {/* Success Rate */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold text-cyan-400 mt-1">
                    {stats?.successRate?.toFixed(1) || "0"}%
                  </p>
                </div>
                <div className="p-2 rounded-lg border bg-cyan-500/20 border-cyan-500/30">
                  <FaChartLine className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            </motion.div>

            {/* Current Streak */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/50 border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold text-orange-400 mt-1">
                    {stats?.currentStreak || "0"} days
                  </p>
                </div>
                <div className="p-2 rounded-lg border bg-orange-500/20 border-orange-500/30">
                  <FiAward className="w-5 h-5 text-orange-400" />
                </div>
              </div>
            </motion.div>

            {/* Global Rank */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800/50 border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Global Rank
                  </p>
                  <p className="text-2xl font-bold text-purple-400 mt-1">
                    #{stats?.rank || "N/A"}
                  </p>
                </div>
                <div className="p-2 rounded-lg border bg-purple-500/20 border-purple-500/30">
                  <FiTrendingUp className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </motion.div>

            {/* Favorite Language */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-slate-800/50 border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Favorite Language
                  </p>
                  <p className="text-xl font-bold text-blue-400 mt-1">
                    {stats?.favoriteLanguage || "N/A"}
                  </p>
                </div>
                <div className="p-2 rounded-lg border bg-blue-500/20 border-blue-500/30">
                  <FaCode className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Submissions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-800/50 border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FiActivity className="w-5 h-5 text-cyan-400" />
                My Recent Submissions
              </h2>
              <span className="text-sm text-gray-400">
                {stats?.recentSubmissions?.length || 0} submissions
              </span>
            </div>

            {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Problem
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Difficulty
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Language
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Result
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Points
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentSubmissions
                      .slice(0, 5)
                      .map((submission, index) => (
                        <tr
                          key={submission._id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 px-4 text-white">
                            {submission.problemName}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-medium ${getDifficultyColor(submission.difficulty)}`}
                            >
                              {submission.difficulty}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {submission.language}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                submission.result === "Success"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {submission.result === "Success" ? (
                                <FiCheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <FiAlertCircle className="w-3 h-3 mr-1" />
                              )}
                              {submission.result}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-yellow-400 font-medium">
                            {submission.points > 0
                              ? `+${submission.points}`
                              : "0"}
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-sm">
                            {formatDate(submission.submittedAt)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FiActivity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent submissions</p>
                <p className="text-sm mt-2">
                  Start solving problems to see your submissions here!
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="xl:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-800/50 border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FiActivity className="w-5 h-5 text-cyan-400" />
              Quick Actions
            </h2>

            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.path}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Link to={action.path}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 p-4 border rounded-xl transition-all duration-200 hover:shadow-lg ${getColorClasses(action.color)}`}
                    >
                      <div className="p-2 rounded-lg border bg-current/20">
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{action.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Daily Progress */}
            <div className="mt-8 space-y-4">
              <div className="bg-slate-700/50 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      Solved Today
                    </p>
                    <p className="text-lg font-bold text-green-400 mt-1">
                      {stats?.problemsSolvedToday || "0"} problems
                    </p>
                  </div>
                  <div className="p-2 rounded-lg border bg-green-500/20 border-green-500/30">
                    <FiCheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </div>

              {/* Motivation Card */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-cyan-400 mb-2">
                  Keep Going! 🚀
                </h3>
                <p className="text-xs text-gray-400">
                  {stats?.problemsSolvedToday && stats.problemsSolvedToday > 0
                    ? "Great progress today! Consistency is key to mastery."
                    : "Start your coding journey today. Every problem solved makes you better!"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDashboardHome;
