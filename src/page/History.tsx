import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hook/useAxiosSecure";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  FileText,
  RefreshCw,
  Star,
  Target,
  Calendar,
  BarChart3,
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

type SubmissionsResponse = Submission[] | { message: string };

const History = () => {
  const { user } = useContext(AuthContext)!;
  const axiosSecure = useAxiosSecure();

  const email =
    user?.email?.toLowerCase() ||
    user?.providerData?.[0]?.email?.toLowerCase();

  const fetchSubmissions = async (): Promise<SubmissionsResponse> => {
    if (!email) throw new Error("No user email found");

    try {
      const res = await axiosSecure.get<SubmissionsResponse>(
        `/api/users/submissions/${email}`
      );
      return res.data;
    } catch (err: any) {
      if (err.response?.data?.message === "No submissions found") {
        return { message: "No submissions found" };
      }
      throw new Error(
        err.response?.data?.message || err.message || "Failed to load submissions"
      );
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery<SubmissionsResponse>({
    queryKey: ["submissions", email],
    queryFn: fetchSubmissions,
    enabled: !!email,
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;

  if (isError)
    return (
      <div className="flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-3xl backdrop-blur-xl max-w-md w-full"
        >
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Error Loading Submissions
          </h2>
          <p className="text-gray-300 mb-6">
            {error instanceof Error ? error.message : "Failed to load your submission history"}
          </p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 hover:bg-cyan-500/30 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </motion.div>
      </div>
    );

  const isMessageData = (d: SubmissionsResponse): d is { message: string } =>
    typeof d === "object" && !Array.isArray(d) && "message" in d;

  const noSubmissions =
    !data || (isMessageData(data) && data.message === "No submissions found") || (Array.isArray(data) && data.length === 0);

  if (noSubmissions) {
    return (
      <div className="flex flex-col justify-center items-center text-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
            <FileText className="w-16 h-16 text-cyan-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">No Submissions Yet</h2>
          <p className="text-gray-300 text-xl mb-6 leading-relaxed">
            Start your coding journey and track your progress here!
          </p>
          <p className="text-cyan-300 mb-8 text-lg">
            🚀 Your first submission will appear here
          </p>
          <motion.a
            href="/problems"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 border border-cyan-400/30 text-lg"
          >
            <Award className="w-6 h-6" />
            Solve Your First Problem
            <TrendingUp className="w-6 h-6" />
          </motion.a>
        </motion.div>
      </div>
    );
  }

  const submissions = Array.isArray(data) ? data : [];

  const stats = {
    total: submissions.length,
    success: submissions.filter((s) => s.status === "Success").length,
    failed: submissions.filter((s) => s.status === "Failure").length,
    totalPoints: submissions.reduce((sum, s) => sum + (s.point > 0 ? s.point : 0), 0),
    successRate: submissions.length
      ? ((submissions.filter((s) => s.status === "Success").length / submissions.length) * 100).toFixed(1)
      : "0",
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
        return "text-cyan-400";
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 border-red-500/30";
      default:
        return "bg-cyan-500/20 border-cyan-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Success" ? "text-green-400" : "text-red-400";
  };

  const getStatusBg = (status: string) => {
    return status === "Success" ? "bg-green-500/20 border-green-500/30" : "bg-red-500/20 border-red-500/30";
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
          Submission History
        </h1>
        <p className="text-gray-400">Track your coding journey and monitor your progress over time</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {stats.total}
          </h2>
          <p className="text-gray-400 text-sm">Total Submissions</p>
        </div>

        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {stats.success}
          </h2>
          <p className="text-gray-400 text-sm">Success</p>
        </div>

        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
              <XCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {stats.failed}
          </h2>
          <p className="text-gray-400 text-sm">Failed</p>
        </div>

        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
              <Star className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {stats.totalPoints}
          </h2>
          <p className="text-gray-400 text-sm">Total Points</p>
        </div>
      </motion.div>

      {/* Success Rate Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl p-4 mb-6 backdrop-blur-xl"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-xl">
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Success Rate</h3>
              <p className="text-gray-400 text-sm">Based on all your submissions</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-2xl font-bold text-cyan-400">{stats.successRate}%</div>
            <div className="text-gray-400 text-sm">
              {stats.success} out of {stats.total} submissions
            </div>
          </div>
        </div>
      </motion.div>

      {/* Submission Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-white/10">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">Problem</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">Difficulty</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">Category</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">Status</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">Points</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, index) => (
                <tr 
                  key={sub._id} 
                  className="border-b border-white/5 hover:bg-slate-700/30 transition-colors duration-200"
                >
                  <td className="py-4 px-6">
                    <div className="text-white font-medium">
                      {sub.problemTitle}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDifficultyBg(sub.problemDifficulty)} ${getDifficultyColor(sub.problemDifficulty)}`}>
                      {sub.problemDifficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-300">{sub.problemCategory}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {sub.status === "Success" ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={getStatusColor(sub.status)}>{sub.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      sub.point > 0 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {sub.point > 0 ? `+${sub.point}` : sub.point}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-300 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 p-4">
          {submissions.map((sub) => (
            <div 
              key={sub._id}
              className="bg-slate-700/30 border border-white/10 rounded-xl p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-white font-semibold flex-1 mr-4">
                  {sub.problemTitle}
                </h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(sub.status)} ${getStatusColor(sub.status)}`}>
                  {sub.status === "Success" ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {sub.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Difficulty</span>
                  <div className={`font-medium ${getDifficultyColor(sub.problemDifficulty)}`}>
                    {sub.problemDifficulty}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Category</span>
                  <div className="text-gray-300">{sub.problemCategory}</div>
                </div>
                <div>
                  <span className="text-gray-400">Points</span>
                  <div className={`font-medium ${
                    sub.point > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {sub.point > 0 ? `+${sub.point}` : sub.point}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Date</span>
                  <div className="text-gray-300 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Empty Table State */}
      {submissions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">No submissions found</h3>
          <p className="text-gray-400">Start solving problems to see your submission history here.</p>
        </motion.div>
      )}
    </div>
  );
};

export default History;