import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container, Typography } from "@mui/material";
import { 
  EmojiEvents, 
  Schedule, 
  Code, 
  People,
  RocketLaunch,
  TrendingUp
} from "@mui/icons-material";
import { FaCalendarAlt, FaClock, FaUsers, FaTrophy, FaPlay } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import useAxiosSecure from "../hook/useAxiosSecure";

type Problem = {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
};

type Contest = {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  problems: Problem[];
  createdAt: string;
  participants: number;
  contestType: string;
};

const ContestSection: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredContest, setHoveredContest] = useState<string | null>(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await axiosSecure.get<Contest[]>("/api/contests");
        const sorted = res.data
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);
        setContests(sorted);
      } catch (err) {
        console.error("Failed to fetch contests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, [axiosSecure]);

  const getTimeRemaining = (startTime: string) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const diff = start - now;
    
    if (diff <= 0) return "Live Now";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `Starts in ${days}d ${hours}h`;
    return `Starts in ${hours}h`;
  };

  const getContestStatus = (startTime: string, endTime: string) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    
    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "live";
    return "completed";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "hard": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <Container maxWidth="xl" className="relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 mb-6"
          >
            <EmojiEvents className="text-yellow-400" />
            <span className="text-lg font-semibold text-white/90">
              Live Competitions
            </span>
          </motion.div>

          <Typography
            variant="h2"
            className="text-center font-bold mb-6 !text-4xl md:!text-6xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            Latest Coding{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Contests
            </span>
          </Typography>

          <Typography
            variant="h6"
            className="text-center text-gray-300 !mt-6 max-w-3xl mx-auto !text-xl leading-relaxed"
          >
            Join exciting coding challenges, test your skills against developers worldwide, 
            and climb the leaderboard to showcase your expertise.
          </Typography>
        </motion.div>

        {/* Contest Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {contests.map((contest, index) => {
            const status = getContestStatus(contest.startTime, contest.endTime);
            const timeRemaining = getTimeRemaining(contest.startTime);
            
            return (
              <motion.div
                key={contest._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                onHoverStart={() => setHoveredContest(contest._id)}
                onHoverEnd={() => setHoveredContest(null)}
                className="group relative"
              >
                {/* Card Background */}
                <div className={`relative rounded-3xl overflow-hidden backdrop-blur-xl border ${
                  status === "live" 
                    ? "border-green-500/30" 
                    : status === "upcoming" 
                      ? "border-yellow-500/30" 
                      : "border-gray-500/30"
                } bg-gradient-to-br from-white/5 to-white/10 shadow-2xl h-full`}>
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm z-10 ${
                    status === "live" 
                      ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                      : status === "upcoming" 
                        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" 
                        : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                  }`}>
                    {status === "live" ? "🔴 LIVE" : status === "upcoming" ? "⏰ UPCOMING" : "✅ COMPLETED"}
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                  <div className="relative z-10 p-6 h-full flex flex-col">
                    {/* Contest Type */}
                    <div className="flex items-center gap-2 mb-4">
                      <Code className="text-cyan-400 text-lg" />
                      <span className="text-sm text-cyan-300 font-medium uppercase tracking-wide">
                        {contest.contestType || "Weekly Contest"}
                      </span>
                    </div>

                    {/* Title */}
                    <Typography
                      variant="h5"
                      className="font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2"
                    >
                      {contest.title}
                    </Typography>

                    {/* Time Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <FaCalendarAlt className="text-purple-400 text-sm" />
                        <div className="text-sm text-gray-300">
                          Starts: {new Date(contest.startTime).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaClock className="text-yellow-400 text-sm" />
                        <div className="text-sm text-gray-300">
                          {timeRemaining}
                        </div>
                      </div>
                    </div>

                    {/* Problems & Participants */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Code className="text-blue-400 text-sm" />
                        <span className="text-sm text-gray-300">
                          {contest.problems.length} Problems
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-green-400 text-sm" />
                        <span className="text-sm text-gray-300">
                          {contest.participants || 0} Participants
                        </span>
                      </div>
                    </div>

                    {/* Problem Difficulties */}
                    <div className="mb-6">
                      <div className="text-xs text-gray-400 mb-2">Problem Difficulties:</div>
                      <div className="flex flex-wrap gap-2">
                        {contest.problems.slice(0, 3).map((problem, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm border ${
                              getDifficultyColor(problem.difficulty).replace('text-', 'bg-')}/20 border-${getDifficultyColor(problem.difficulty).replace('text-', '')}/30 ${getDifficultyColor(problem.difficulty)}`}
                          >
                            {problem.difficulty}
                          </span>
                        ))}
                        {contest.problems.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{contest.problems.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.a
                      href={`/contests/${contest._id}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`mt-auto w-full py-3 rounded-xl font-bold text-center transition-all duration-300 ${
                        status === "live"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-2xl hover:shadow-green-500/25"
                          : status === "upcoming"
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-2xl hover:shadow-yellow-500/25"
                            : "bg-gradient-to-r from-gray-500 to-gray-600 hover:shadow-2xl hover:shadow-gray-500/25"
                      } text-white flex items-center justify-center gap-2`}
                    >
                      {status === "live" ? (
                        <>
                          <FaPlay className="text-sm" />
                          Join Now
                        </>
                      ) : status === "upcoming" ? (
                        <>
                          <FaClock className="text-sm" />
                          View Details
                        </>
                      ) : (
                        <>
                          <FaTrophy className="text-sm" />
                          View Results
                        </>
                      )}
                    </motion.a>
                  </div>
                </div>

                {/* Floating Elements */}
                {hoveredContest === contest._id && (
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
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.a
            href="/all-contests"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 cursor-pointer"
          >
            <TrendingUp />
            View All Contests
            <RocketLaunch className="text-sm" />
          </motion.a>
        </motion.div>
      </Container>
    </section>
  );
};

export default ContestSection;