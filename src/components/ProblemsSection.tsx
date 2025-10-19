import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import useAxiosSecure from "../hook/useAxiosSecure";
import { 
  FaCode, 
  FaClock, 
  FaFire, 
  FaStar, 
  FaRocket, 
  FaSeedling,
  FaChartLine,
  FaExternalLinkAlt 
} from "react-icons/fa";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  category: string;
  createdAt: string;
}

const ProblemsSection: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axiosSecure.get<Problem[]>("/api/problems");
        setProblems(res.data);
      } catch (err) {
        console.error("Failed to fetch problems:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return <FaSeedling className="text-green-500" />;
      case "medium": return <FaChartLine className="text-yellow-500" />;
      case "hard": return <FaFire className="text-red-500" />;
      default: return <FaCode className="text-blue-500" />;
    }
  };

  const getDifficultyGradient = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "from-green-500/20 to-emerald-400/20";
      case "medium": return "from-yellow-500/20 to-amber-400/20";
      case "hard": return "from-red-500/20 to-rose-400/20";
      default: return "from-blue-500/20 to-cyan-400/20";
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("array")) return "📊";
    if (cat.includes("string")) return "🔤";
    if (cat.includes("tree")) return "🌳";
    if (cat.includes("graph")) return "🕸️";
    if (cat.includes("dynamic")) return "⚡";
    if (cat.includes("math")) return "🧮";
    return "💻";
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <FaRocket className="text-yellow-400 text-sm" />
            <span className="text-sm font-semibold text-white/80">Live Coding Challenges</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            Sharpen Your
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Coding Skills
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Solve <span className="text-cyan-300 font-semibold">real-world problems</span>, test your logic, and level up your programming skills with our carefully curated challenges.
          </p>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{problems.length}+</div>
              <div className="text-white/60 text-sm">Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">3</div>
              <div className="text-white/60 text-sm">Difficulty Levels</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10+</div>
              <div className="text-white/60 text-sm">Categories</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.slice(0, 6).map((problem, index) => (
            <motion.div
              key={problem._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              onHoverStart={() => setHoveredCard(problem._id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="group relative"
            >
              {/* Card Background */}
              <div className={`relative rounded-3xl overflow-hidden backdrop-blur-xl border ${
                problem.difficulty === "easy" 
                  ? "border-green-500/30" 
                  : problem.difficulty === "medium" 
                    ? "border-yellow-500/30" 
                    : "border-red-500/30"
              } bg-gradient-to-br from-white/5 to-white/10 shadow-2xl`}>
                
                {/* Animated Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getDifficultyGradient(problem.difficulty)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                <div className="relative z-10 p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getCategoryIcon(problem.category)}
                      </div>
                      <div className="flex items-center gap-1 text-white/60">
                        {getDifficultyIcon(problem.difficulty)}
                        <span className="text-xs font-medium capitalize">
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    {/* Difficulty Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                      problem.difficulty === "easy"
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : problem.difficulty === "medium"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}>
                      {problem.difficulty}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2">
                    {problem.title}
                  </h3>

                  {/* Category */}
                  <div className="flex items-center gap-2 text-white/60 mb-4">
                    <FaCode className="text-sm" />
                    <span className="text-sm">{problem.category}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-white/50 text-sm">
                      <FaClock className="text-xs" />
                      <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all duration-300 cursor-pointer"
                    >
                      Solve
                      <FaExternalLinkAlt className="text-xs" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              {hoveredCard === problem._id && (
                <>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full blur-sm"
                  />
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full blur-sm"
                  />
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.a
            href="/problems"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 cursor-pointer"
          >
            <FaStar className="text-yellow-300" />
            View All Challenges
            <FaExternalLinkAlt className="text-sm" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemsSection;