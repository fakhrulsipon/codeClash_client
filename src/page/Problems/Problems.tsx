import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import { 
  TrendingUp,
  EmojiEvents,
  Schedule,
  Star,
  Clear
} from "@mui/icons-material";
import { FaCode, FaSearch, FaFire, FaSeedling, FaChartLine, FaRocket } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router";
import useAxiosPublic from "../../hook/useAxiosPublic";

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface StarterCode {
  javascript: string;
  python: string;
  java: string;
  c: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  languages: string[];
  starterCode: StarterCode;
  testCases: TestCase[];
  createdAt: string;
  solvedCount?: number;
  acceptanceRate?: number;
}

const Problems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [category, setCategory] = useState("all");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [isTyping, setIsTyping] = useState(false);
  
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Use debounced search with 500ms delay
  const debouncedSearch = useDebounce(search, 500);

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("title", debouncedSearch);
      if (difficulty !== "all") params.append("difficulty", difficulty);
      if (category !== "all") params.append("category", category);

      const res = await axiosPublic(`/api/problems?${params.toString()}`);
      const sortedProblems = res.data;

      // Sort problems
      switch (sortBy) {
        case "easiest":
          sortedProblems.sort((a: Problem, b: Problem) => {
            const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          });
          break;
        case "hardest":
          sortedProblems.sort((a: Problem, b: Problem) => {
            const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
            return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
          });
          break;
        case "newest":
          sortedProblems.sort((a: Problem, b: Problem) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        default:
          break;
      }

      setProblems(sortedProblems);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  }, [axiosPublic, debouncedSearch, difficulty, category, sortBy]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsTyping(true);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearch("");
    setIsTyping(false);
  };

  const categories = Array.from(new Set(problems.map(p => p.category)));

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return <FaSeedling className="text-green-400" />;
      case "medium": return <FaChartLine className="text-yellow-400" />;
      case "hard": return <FaFire className="text-red-400" />;
      default: return <FaCode className="text-blue-400" />;
    }
  };

  const getDifficultyGradient = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "from-green-500 to-emerald-500";
      case "medium": return "from-yellow-500 to-amber-500";
      case "hard": return "from-red-500 to-rose-500";
      default: return "from-blue-500 to-cyan-500";
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-500/10 border-green-500/30";
      case "medium": return "bg-yellow-500/10 border-yellow-500/30";
      case "hard": return "bg-red-500/10 border-red-500/30";
      default: return "bg-blue-500/10 border-blue-500/30";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "hard": return "text-red-400";
      default: return "text-blue-400";
    }
  };

  const handleConfirm = () => {
    if (selectedProblem) {
      navigate(`/problems/${selectedProblem._id}`);
    }
    setSelectedProblem(null);
  };

  if (loading && !isTyping) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Container maxWidth="xl" className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 mb-6"
          >
            <FaCode className="text-cyan-400" />
            <span className="text-lg font-semibold text-white/90">
              Coding Challenges
            </span>
          </motion.div>

          <Typography
            variant="h2"
            className="text-center font-bold mb-6 !text-4xl md:!text-6xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            Master Your{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Coding Skills
            </span>
          </Typography>

          <Typography
            variant="h6"
            className="text-center text-gray-300 !mt-6 max-w-3xl mx-auto !text-xl leading-relaxed"
          >
            Solve real-world coding problems, compete with developers worldwide, 
            and track your progress with our comprehensive learning platform.
          </Typography>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { icon: <FaCode className="text-2xl" />, number: problems.length, label: "Total Problems", color: "text-cyan-400" },
            { icon: <TrendingUp className="text-2xl" />, number: "3", label: "Difficulty Levels", color: "text-yellow-400" },
            { icon: <EmojiEvents className="text-2xl" />, number: categories.length, label: "Categories", color: "text-purple-400" },
            { icon: <Schedule className="text-2xl" />, number: "24/7", label: "Available", color: "text-green-400" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm"
            >
              <div className={`${stat.color} mb-2 flex justify-center`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search Input with Clear Button */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              />
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Clear className="text-lg" />
                </motion.button>
              )}
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-6 left-0 text-xs text-cyan-400 flex items-center gap-1"
                >
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ●
                  </motion.div>
                  Searching...
                </motion.div>
              )}
            </div>

            {/* Difficulty Filter */}
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <option value="all" className="bg-slate-900">All Difficulties</option>
              <option value="easy" className="bg-slate-900">🟢 Easy</option>
              <option value="medium" className="bg-slate-900">🟡 Medium</option>
              <option value="hard" className="bg-slate-900">🔴 Hard</option>
            </select>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <option value="all" className="bg-slate-900">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <option value="newest" className="bg-slate-900">Newest First</option>
              <option value="easiest" className="bg-slate-900">Easiest First</option>
              <option value="hardest" className="bg-slate-900">Hardest First</option>
            </select>
          </div>

          {/* Active Filters Display */}
          {(debouncedSearch || difficulty !== "all" || category !== "all") && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {debouncedSearch && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm"
                >
                  Search: "{debouncedSearch}"
                  <button
                    onClick={() => setSearch("")}
                    className="hover:text-cyan-100 transition-colors"
                  >
                    <Clear className="text-xs" />
                  </button>
                </motion.div>
              )}
              {difficulty !== "all" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm"
                >
                  Difficulty: {difficulty}
                  <button
                    onClick={() => setDifficulty("all")}
                    className="hover:text-purple-100 transition-colors"
                  >
                    <Clear className="text-xs" />
                  </button>
                </motion.div>
              )}
              {category !== "all" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm"
                >
                  Category: {category}
                  <button
                    onClick={() => setCategory("all")}
                    className="hover:text-blue-100 transition-colors"
                  >
                    <Clear className="text-xs" />
                  </button>
                </motion.div>
              )}
              {(debouncedSearch || difficulty !== "all" || category !== "all") && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => {
                    setSearch("");
                    setDifficulty("all");
                    setCategory("all");
                  }}
                  className="px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full text-gray-300 text-sm hover:bg-gray-500/30 transition-colors"
                >
                  Clear All
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Problems Display - Table for Desktop, Cards for Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10"
        >
          {isMobile ? (
            /* Mobile Card View */
            <div className="grid gap-6">
              <AnimatePresence>
                {problems.map((problem, index) => (
                  <motion.div
                    key={problem._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    {/* Problem Card */}
                    <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 transition-all duration-500 group-hover:border-cyan-500/30">
                      
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                      <div className="relative z-10">
                        {/* Difficulty Badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 ${getDifficultyBg(problem.difficulty)}`}>
                          {getDifficultyIcon(problem.difficulty)}
                          <span className="capitalize">{problem.difficulty}</span>
                        </div>

                        {/* Title */}
                        <Typography
                          variant="h6"
                          className="font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2"
                        >
                          {problem.title}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          className="text-gray-300 mb-4 line-clamp-3 leading-relaxed"
                        >
                          {problem.description}
                        </Typography>

                        {/* Category & Stats */}
                        <div className="flex items-center justify-between mb-6">
                          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-full text-xs font-medium">
                            {problem.category}
                          </span>
                          
                          <div className="flex items-center gap-1 text-gray-400 text-xs">
                            <Star className="text-yellow-400 text-sm" />
                            <span>{problem.acceptanceRate || "80"}% Acceptance</span>
                          </div>
                        </div>

                        {/* Solve Button */}
                        <motion.button
                          onClick={() => setSelectedProblem(problem)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${getDifficultyGradient(problem.difficulty)} hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2`}
                        >
                          <FaRocket className="text-sm" />
                          Solve Challenge
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* Desktop Table View */
            <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-6 px-6 text-gray-300 font-semibold text-sm">Problem</th>
                    <th className="text-left py-6 px-6 text-gray-300 font-semibold text-sm">Difficulty</th>
                    <th className="text-left py-6 px-6 text-gray-300 font-semibold text-sm">Category</th>
                    <th className="text-left py-6 px-6 text-gray-300 font-semibold text-sm">Acceptance</th>
                    <th className="text-left py-6 px-6 text-gray-300 font-semibold text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {problems.map((problem, index) => (
                      <motion.tr
                        key={problem._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 group"
                      >
                        {/* Problem Title & Description */}
                        <td className="py-5 px-6">
                          <div className="flex flex-col">
                            <Typography
                              variant="subtitle1"
                              className="font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 mb-1"
                            >
                              {problem.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-gray-400 line-clamp-2 text-sm"
                            >
                              {problem.description}
                            </Typography>
                          </div>
                        </td>

                        {/* Difficulty */}
                        <td className="py-5 px-6">
                          <div className={`flex items-center gap-2 ${getDifficultyColor(problem.difficulty)} font-medium`}>
                            {getDifficultyIcon(problem.difficulty)}
                            <span className="capitalize">{problem.difficulty}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-5 px-6">
                          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-full text-xs font-medium">
                            {problem.category}
                          </span>
                        </td>

                        {/* Acceptance Rate */}
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
                                style={{ width: `${problem.acceptanceRate || 80}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-300 text-sm font-medium">
                              {problem.acceptanceRate || 80}%
                            </span>
                          </div>
                        </td>

                        {/* Action Button */}
                        <td className="py-5 px-6">
                          <motion.button
                            onClick={() => setSelectedProblem(problem)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`py-2 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${getDifficultyGradient(problem.difficulty)} hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm`}
                          >
                            <FaRocket className="text-xs" />
                            Solve
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}

          {/* No Results Message */}
          {problems.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <Typography variant="h5" className="text-white mb-2">
                No problems found
              </Typography>
              <Typography variant="body1" className="text-gray-400">
                Try adjusting your search criteria or filters
              </Typography>
            </motion.div>
          )}
        </motion.div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {selectedProblem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full backdrop-blur-xl"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaRocket className="text-white text-2xl" />
                  </div>
                  <Typography variant="h5" className="text-white font-bold mb-2">
                    Ready to Solve?
                  </Typography>
                  <Typography variant="body2" className="text-gray-300">
                    You're about to start solving{" "}
                    <span className="text-cyan-400 font-semibold">
                      {selectedProblem.title}
                    </span>
                    . Are you ready for this challenge?
                  </Typography>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    onClick={handleConfirm}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
                  >
                    Let's Solve!
                  </motion.button>
                  <motion.button
                    onClick={() => setSelectedProblem(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default Problems;