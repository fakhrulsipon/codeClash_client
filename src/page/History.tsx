import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { AuthContext } from "../provider/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hook/useAxiosSecure";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  TrendingUp, 
  FileText,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";

interface Submission {
  _id: string;
  userEmail: string;
  userName: string;
  status: string;
  problemTitle: string;
  problemDifficulty: string;
  problemCategory: string;
  point: number;
  submittedAt: string;
}

const History = () => {
  const { user } = use(AuthContext)!;
  const email = user?.email;
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError, error, refetch } = useQuery<Submission[]>({
    queryKey: ["submissions", email],
    queryFn: async () => {
      if (!email) {
        throw new Error("No user email found");
      }
      
      try {
        // Use the correct endpoint from your backend
        const res = await axiosSecure.get(`/api/users/submissions/${email}`);
        console.log("✅ Submissions loaded:", res.data);
        return res.data;
      } catch (error: any) {
        console.error("❌ Failed to load submissions:", error);
        throw new Error(
          error.response?.data?.message || 
          error.message || 
          "Failed to load submissions"
        );
      }
    },
    enabled: !!email,
    retry: 1,
  });

  // Calculate statistics
  const stats = {
    total: data?.length || 0,
    success: data?.filter(s => s.status === "Success").length || 0,
    failed: data?.filter(s => s.status === "Failure").length || 0,
    totalPoints: data?.reduce((sum, s) => sum + (s.point > 0 ? s.point : 0), 0) || 0,
    successRate: data?.length ? ((data.filter(s => s.status === "Success").length / data.length) * 100).toFixed(1) : "0"
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "hard": return "text-red-400";
      default: return "text-blue-400";
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-500/20 border-green-500/30";
      case "medium": return "bg-yellow-500/20 border-yellow-500/30";
      case "hard": return "bg-red-500/20 border-red-500/30";
      default: return "bg-blue-500/20 border-blue-500/30";
    }
  };

  if (isLoading) return <LoadingSpinner />;

  // Handle API errors
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-xl max-w-md">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Submissions</h2>
          <p className="text-gray-300 mb-4">
            {error instanceof Error ? error.message : "Failed to load your submission history"}
          </p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 hover:bg-cyan-500/30 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // যদি ডাটা ফাঁকা হয় বা কিছু না আসে
  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-6 relative">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
            <FileText className="w-16 h-16 text-purple-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            No Submissions Yet
          </h2>
          <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
            You haven't submitted any problem solutions yet.  
            Start solving problems and your history will appear here!
          </p>
          
          <motion.a
            href="/problems"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 border border-cyan-400/30"
          >
            <Award className="w-5 h-5" />
            Solve Your First Problem
            <TrendingUp className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Submission History
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Track your coding journey and monitor your progress over time
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Submissions</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-white">{stats.successRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-yellow-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Points</p>
                <p className="text-2xl font-bold text-white">{stats.totalPoints}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Problems Solved</p>
                <p className="text-2xl font-bold text-white">{stats.success}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Table Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  All Submissions
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {data.length} total submissions • Success Rate: {stats.successRate}%
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 hover:bg-cyan-500/30 transition-all duration-300">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Problem</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Difficulty</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Submitted</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.map((submission, idx) => (
                  <motion.tr
                    key={submission._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="hover:bg-white/5 transition-all duration-300 group"
                  >
                    <td className="px-6 py-4">
                      <div className="text-gray-400 font-mono">{idx + 1}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                        {submission.problemTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getDifficultyBg(submission.problemDifficulty)} ${getDifficultyColor(submission.problemDifficulty)}`}>
                        {submission.problemDifficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300 capitalize">{submission.problemCategory}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(submission.submittedAt).toLocaleDateString()}
                        <span className="text-gray-500">
                          {new Date(submission.submittedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                        submission.status === "Success" 
                          ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}>
                        {submission.status === "Success" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {submission.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-bold ${
                        submission.point > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {submission.point > 0 ? '+' : ''}{submission.point}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <div className="flex justify-between items-center text-sm text-gray-400">
              <div>Showing {data.length} submissions</div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {stats.success} passed
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-red-400" />
                  {stats.failed} failed
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default History;