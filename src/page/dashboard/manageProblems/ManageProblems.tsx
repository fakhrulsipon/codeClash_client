import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiEdit,
  FiTrash2,
  FiSearch,
  FiAlertCircle,
  FiPlus,
  FiCode,
  FiTag,
  FiBarChart2,
} from "react-icons/fi";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import Swal from "sweetalert2";

// ✅ Problem type based on your backend
interface Problem {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard" | string;
  languages: string[];
  starterCode: any;
  testCases: any[];
  createdAt: string;
}

const ManageProblems = () => {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const axiosSecure = useAxiosSecure();

  const {
    data: problems = [],
    refetch,
    isLoading,
  } = useQuery<Problem[]>({
    queryKey: ["problems"],
    queryFn: async () => {
      const res = await axiosSecure.get<Problem[]>("/api/problems");
      return res.data;
    },
  });

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      background: "#1e293b",
      color: "white",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/api/problems/${id}`);
        toast.success("Problem deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete problem");
      }
    }
  };

  // Get unique categories for filter
  const categories = [...new Set(problems.map((p) => p.category))];

  // Filter problems based on search and filters
  const filteredProblems = problems.filter((problem: Problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.description.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" || problem.difficulty === difficultyFilter;
    const matchesCategory =
      categoryFilter === "all" || problem.category === categoryFilter;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "hard":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      "text-blue-400 bg-blue-500/20 border-blue-500/30",
      "text-purple-400 bg-purple-500/20 border-purple-500/30",
      "text-cyan-400 bg-cyan-500/20 border-cyan-500/30",
      "text-orange-400 bg-orange-500/20 border-orange-500/30",
      "text-pink-400 bg-pink-500/20 border-pink-500/30",
    ];
    const index = categories.indexOf(category) % colors.length;
    return colors[index];
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
            Manage Problems
          </h2>
          <p className="text-gray-400">Manage and organize coding problems</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            onClick={() => (window.location.href = "/dashboard/addProblem")}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-500 transition-all duration-200 border border-cyan-400/50 whitespace-nowrap"
          >
            <FiPlus className="w-4 h-4" />
            Add Problem
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-3">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Problems</p>
          <p className="text-2xl font-bold text-white">{problems.length}</p>
        </div>
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Easy</p>
          <p className="text-2xl font-bold text-green-400">
            {problems.filter((p) => p.difficulty === "easy").length}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Medium</p>
          <p className="text-2xl font-bold text-yellow-400">
            {problems.filter((p) => p.difficulty === "medium").length}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Hard</p>
          <p className="text-2xl font-bold text-red-400">
            {problems.filter((p) => p.difficulty === "hard").length}
          </p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50 border-b border-white/10">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">
                Problem
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">
                Category
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">
                Difficulty
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">
                Languages
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-cyan-300">
                Created
              </th>
              <th className="py-4 px-6 text-center text-sm font-semibold text-cyan-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map((problem: Problem, idx: number) => (
              <motion.tr
                key={problem._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-white/5 hover:bg-slate-700/30 transition-colors duration-200"
              >
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-white">{problem.title}</p>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {problem.description.substring(0, 100)}...
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(problem.category)}`}
                  >
                    <FiTag className="w-3 h-3 mr-1" />
                    {problem.category}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}
                  >
                    <FiBarChart2 className="w-3 h-3 mr-1" />
                    {problem.difficulty.charAt(0).toUpperCase() +
                      problem.difficulty.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1">
                    {problem.languages?.slice(0, 3).map((lang, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-600/50 text-gray-300 border border-white/10"
                      >
                        {lang}
                      </span>
                    ))}
                    {problem.languages?.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{problem.languages.length - 3} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-400 text-sm">
                  {new Date(problem.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all duration-200 hover:scale-110 border border-blue-500/30"
                      onClick={() => toast("Edit feature coming soon ✏️")}
                      title="Edit Problem"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200 hover:scale-110 border border-red-500/30"
                      title="Delete Problem"
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
        {filteredProblems.map((problem: Problem, idx: number) => (
          <motion.div
            key={problem._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-lg"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-1">
                    {problem.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(problem.category)}`}
                    >
                      <FiTag className="w-3 h-3 mr-1" />
                      {problem.category}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}
                    >
                      <FiBarChart2 className="w-3 h-3 mr-1" />
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm line-clamp-3">
                {problem.description}
              </p>

              {/* Languages */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Languages:</p>
                <div className="flex flex-wrap gap-1">
                  {problem.languages?.map((lang, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-600/50 text-gray-300 border border-white/10"
                    >
                      <FiCode className="w-3 h-3 mr-1" />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="text-xs text-gray-400">
                Created: {new Date(problem.createdAt).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-3 border-t border-white/10">
                <button
                  className="flex items-center gap-1 px-3 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-sm transition-all duration-200 border border-blue-500/30"
                  onClick={() => toast("Edit feature coming soon ✏️")}
                >
                  <FiEdit className="w-4 h-4" />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(problem._id)}
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
      {filteredProblems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <FiAlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No problems found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or create a new problem
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageProblems;
