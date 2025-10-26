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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-red-100 border border-red-300 rounded-2xl shadow-md max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            Error Loading Submissions
          </h2>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : "Failed to load your submission history"}
          </p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-red-200 border border-red-300 rounded-lg text-red-700 hover:bg-red-300 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );

  const isMessageData = (d: SubmissionsResponse): d is { message: string } =>
    typeof d === "object" && !Array.isArray(d) && "message" in d;

  const noSubmissions =
    !data || (isMessageData(data) && data.message === "No submissions found") || (Array.isArray(data) && data.length === 0);

  if (noSubmissions) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border border-blue-200">
            <FileText className="w-16 h-16 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Submissions Yet</h2>
          <p className="text-gray-600 mb-6 max-w-md text-lg leading-relaxed">
            You haven’t solved or submitted any problems yet. <br />
            Once you start solving, your progress will be displayed here.
          </p>
          <p className="text-blue-500 mb-8 text-sm">
            🚀 Start your coding journey and submit your first solution
          </p>
          <motion.a
            href="/problems"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-blue-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-md hover:bg-blue-600 transition-all duration-300"
          >
            <Award className="w-5 h-5" />
            Solve Your First Problem
            <TrendingUp className="w-5 h-5" />
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
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "hard":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Submission History
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track your coding journey and monitor your progress over time
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white border rounded-xl text-center shadow">
            <div className="text-gray-500 text-sm">Total Submissions</div>
            <div className="text-gray-800 font-bold text-xl">{stats.total}</div>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center shadow">
            <div className="text-green-600 text-sm">Success</div>
            <div className="text-green-800 font-bold text-xl">{stats.success}</div>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center shadow">
            <div className="text-red-600 text-sm">Failed</div>
            <div className="text-red-800 font-bold text-xl">{stats.failed}</div>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center shadow">
            <div className="text-yellow-600 text-sm">Total Points</div>
            <div className="text-yellow-800 font-bold text-xl">{stats.totalPoints}</div>
          </div>
        </div>

        {/* Submission Table */}
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow">
          <table className="min-w-full text-left text-gray-800 text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3">Problem</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Points</th>
                <th className="px-4 py-3">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub._id} className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200">
                  <td className="px-4 py-3">{sub.problemTitle}</td>
                  <td className={`px-4 py-3 font-semibold ${getDifficultyColor(sub.problemDifficulty)}`}>
                    {sub.problemDifficulty}
                  </td>
                  <td className="px-4 py-3">{sub.problemCategory}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    {sub.status === "Success" ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    {sub.status}
                  </td>
                  <td className="px-4 py-3">{sub.point}</td>
                  <td className="px-4 py-3">{new Date(sub.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
