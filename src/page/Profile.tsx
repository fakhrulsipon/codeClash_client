import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import CountUp from "react-countup";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaAward,
  FaRocket,
  FaTrophy,
  FaChartLine,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hook/useAxiosSecure";

type Growth = { date: string; count: number };

type UserPoints = {
  email?: string;
  totalPoints?: number;
  totalSubmissions?: number;
  successCount?: number;
  failureCount?: number;
  growth?: Growth[];
  message?: string;
};

const COLORS = ["#00D4FF", "#FF0080"];

const Profile: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const email = user?.email || user?.providerData?.[0]?.email;
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError, error, refetch } = useQuery<UserPoints>({
    queryKey: ["userPoints", email],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/api/users/profile/${email}`);
        return res.data;
      } catch (err: any) {
        if (err.response?.data?.message === "User not found or no submissions") {
          return { message: "User not found or no submissions" };
        }
        throw err;
      }
    },
    enabled: !!email,
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;

  if (isError && !data?.message) {
    return (
      <div className="flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-3xl backdrop-blur-xl max-w-md w-full"
        >
          <FaTimesCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-300 mb-4">
            {error instanceof Error
              ? error.message
              : "Failed to load your profile data"}
          </p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 hover:bg-cyan-500/30 transition-all duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (data?.message === "User not found or no submissions") {
    return (
      <div className="flex flex-col justify-center items-center text-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          {/* User Info */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6">
              <img
                src={user?.photoURL || "https://i.ibb.co/2y7QbZk/user.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-cyan-400/50 shadow-2xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full p-2 border-4 border-slate-900">
                <FaUser className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {user?.displayName || "Anonymous User"}
            </h1>
            <p className="text-gray-400">{user?.email}</p>
          </div>

          {/* Empty State Illustration */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
              <FaAward className="w-16 h-16 text-purple-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Begin Your Journey
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your coding adventure starts here. Solve problems, earn points, and track your progress!
            </p>
          </div>

          <motion.a
            href="/problems"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:shadow-cyan-500/25 transition-all duration-300 border border-cyan-400/30"
          >
            <FaRocket className="w-5 h-5" />
            Start Solving Problems
            <FaTrophy className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    );
  }

  // Calculate success rate
  const successRate = data?.totalSubmissions 
    ? Math.round(((data.successCount || 0) / data.totalSubmissions) * 100)
    : 0;

  return (
    <div className="p-4 lg:p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4 mb-4 lg:mb-0">
          <div className="relative">
            <img
              src={user?.photoURL || "https://i.ibb.co/2y7QbZk/user.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-cyan-400/50 object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full p-1 border-2 border-slate-900">
              <FaUser className="w-2 h-2 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user?.displayName || "Anonymous User"}
            </h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>
        
        {/* Success Rate Badge */}
        <div className="bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-center">
          <div className="text-2xl font-bold text-cyan-400">{successRate}%</div>
          <div className="text-gray-400 text-sm">Success Rate</div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {/* Total Points */}
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
              <FaStar className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            <CountUp end={data?.totalPoints ?? 0} duration={2.5} />
          </h2>
          <p className="text-gray-400 text-sm">Total Points</p>
        </div>

        {/* Total Submissions */}
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <FaClipboardList className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            <CountUp end={data?.totalSubmissions ?? 0} duration={2.5} />
          </h2>
          <p className="text-gray-400 text-sm">Submissions</p>
        </div>

        {/* Success Count */}
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <FaCheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            <CountUp end={data?.successCount ?? 0} duration={2.5} />
          </h2>
          <p className="text-gray-400 text-sm">Success</p>
        </div>

        {/* Failure Count */}
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
              <FaTimesCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            <CountUp end={data?.failureCount ?? 0} duration={2.5} />
          </h2>
          <p className="text-gray-400 text-sm">Failure</p>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6"
      >
        {/* Pie Chart */}
        <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaChartLine className="text-cyan-400" />
            Success Distribution
          </h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Success", value: data?.successCount ?? 0 },
                    { name: "Failure", value: data?.failureCount ?? 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaTrophy className="text-purple-400" />
            Progress Over Time
          </h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.growth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={10}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#00D4FF"
                  strokeWidth={2}
                  dot={{ fill: '#00D4FF', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, fill: '#00D4FF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Motivational Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl p-4 mb-6"
      >
        <h2 className="text-lg font-bold text-white mb-4 text-center">
          Level Up Your Skills 🚀
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            "Solve daily challenges to build consistency",
            "Review failed submissions to learn and improve",
            "Focus on algorithm optimization techniques",
            "Participate in coding contests regularly",
            "Study data structures and patterns",
            "Collaborate and learn from the community"
          ].map((tip, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-400">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
              <span className="text-xs">{tip}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <a
          href="/problems"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300 border border-cyan-400/30 text-sm"
        >
          <FaRocket className="w-4 h-4" />
          Continue Coding Journey
          <FaTrophy className="w-4 h-4" />
        </a>
        <p className="text-gray-500 mt-3 text-sm italic">
          Every problem solved brings you one step closer to mastery! ✨
        </p>
      </motion.div>
    </div>
  );
};

export default Profile;