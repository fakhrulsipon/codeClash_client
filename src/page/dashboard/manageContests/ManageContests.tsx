import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiPause, FiPlay, FiTrash2, FiSearch, FiAlertCircle } from "react-icons/fi";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import useAxiosPublic from "../../../hook/useAxiosPublic";

// ✅ Contest type
interface Problem {
  _id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard" | string;
}

interface Contest {
  _id: string;
  title: string;
  paused: boolean;
  problems?: Problem[];
  type?: "individual" | "team";
  startTime?: string;
  endTime?: string;
}

const ManageContests = () => {
  const [search, setSearch] = useState("");
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const {
    data: contests = [],
    refetch,
    isLoading,
  } = useQuery<Contest[]>({
    queryKey: ["contests"],
    queryFn: async () => {
      const res = await axiosSecure.get<Contest[]>("/api/contests");
      return res.data;
    },
  });

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e293b',
      color: 'white'
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/api/contests/${id}`);
        toast.success("Contest deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete contest");
      }
    }
  };

  const togglePause = async (contest: Contest) => {
    try {
      const updated = { paused: !contest.paused };
      await axiosSecure.put(`/api/contests/${contest._id}`, updated);
      toast.success(`Contest ${contest.paused ? "unpaused" : "paused"}!`);
      refetch();
    } catch (error) {
      toast.error("Failed to update contest status");
    }
  };

  const filtered = contests.filter((c: Contest) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400 bg-green-500/20 border-green-500/30";
      case "medium": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "hard": return "text-red-400 bg-red-500/20 border-red-500/30";
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getContestTypeColor = (type?: string) => {
    return type === "team" 
      ? "text-purple-400 bg-purple-500/20 border-purple-500/30"
      : "text-cyan-400 bg-cyan-500/20 border-cyan-500/30";
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-6"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Manage Contests
          </h2>
          <p className="text-gray-400">Manage and monitor all coding competitions</p>
        </div>

        <div className="relative w-full lg:w-80">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search contests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Contests</p>
          <p className="text-2xl font-bold text-white">{contests.length}</p>
        </div>
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Active Contests</p>
          <p className="text-2xl font-bold text-green-400">
            {contests.filter(c => !c.paused).length}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Team Contests</p>
          <p className="text-2xl font-bold text-purple-400">
            {contests.filter(c => c.type === "team").length}
          </p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50 border-b border-white/10">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">Contest</th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">Type</th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">Difficulty</th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">Status</th>
              <th className="py-4 px-6 text-center text-sm font-semibold text-cyan-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((contest: Contest, idx: number) => (
              <motion.tr
                key={contest._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-white/5 hover:bg-slate-700/30 transition-colors duration-200"
              >
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-white">{contest.title}</p>
                    {contest.startTime && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(contest.startTime).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getContestTypeColor(contest.type)}`}>
                    {contest.type === "team" ? "👥 Team" : "👤 Individual"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {contest.problems && contest.problems.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {[...new Set(contest.problems.map((p: Problem) => p.difficulty))].map((diff, i) => (
                        <span 
                          key={i}
                          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(diff)}`}
                        >
                          {diff}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">No problems</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  {contest.paused ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                      <FiPause className="w-4 h-4 mr-1" />
                      Paused
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                      <FiPlay className="w-4 h-4 mr-1" />
                      Active
                    </span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => togglePause(contest)}
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                        contest.paused
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30"
                      }`}
                      title={contest.paused ? "Unpause Contest" : "Pause Contest"}
                    >
                      {contest.paused ? <FiPlay className="w-4 h-4" /> : <FiPause className="w-4 h-4" />}
                    </button>

                    <button
                      className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all duration-200 hover:scale-110 border border-blue-500/30"
                      onClick={() => toast("Edit feature coming soon ✏️")}
                      title="Edit Contest"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(contest._id)}
                      className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200 hover:scale-110 border border-red-500/30"
                      title="Delete Contest"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {filtered.map((contest: Contest, idx: number) => (
          <motion.div
            key={contest._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-lg"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-1">{contest.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getContestTypeColor(contest.type)}`}>
                      {contest.type === "team" ? "👥 Team" : "👤 Individual"}
                    </span>
                    {contest.paused ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                        <FiPause className="w-3 h-3 mr-1" />
                        Paused
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                        <FiPlay className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Difficulty Levels:</p>
                {contest.problems && contest.problems.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(contest.problems.map((p: Problem) => p.difficulty))].map((diff, i) => (
                      <span 
                        key={i}
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(diff)}`}
                      >
                        {diff}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">No problems assigned</span>
                )}
              </div>

              {/* Date */}
              {contest.startTime && (
                <div className="text-xs text-gray-400">
                  Starts: {new Date(contest.startTime).toLocaleDateString()}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-3 border-t border-white/10">
                <button
                  onClick={() => togglePause(contest)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    contest.paused
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                      : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30"
                  }`}
                >
                  {contest.paused ? <FiPlay className="w-4 h-4" /> : <FiPause className="w-4 h-4" />}
                  {contest.paused ? "Unpause" : "Pause"}
                </button>

                <button
                  className="flex items-center gap-1 px-3 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-sm transition-all duration-200 border border-blue-500/30"
                  onClick={() => toast("Edit feature coming soon ✏️")}
                >
                  <FiEdit className="w-4 h-4" />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(contest._id)}
                  className="flex items-center gap-1 px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm transition-all duration-200 border border-red-500/30"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <FiAlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No contests found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageContests;