import React, { useEffect, useState,} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Typography } from "@mui/material";
import {
  EmojiEvents,
  Schedule,
  People,
  Code,
} from "@mui/icons-material";
import {
  FaSearch,
  FaUsers,
  FaUser,
  FaRocket,
  FaFire,
  FaSeedling,
  FaChartLine,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAxiosSecure from "../../hook/useAxiosSecure";

type Problem = {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
};

type Contest = {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  problems: Problem[];
  createdAt: string;
  type: "individual" | "team";
  participants?: number;
  description?: string;
};

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

const AllContests: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [participantCounts, setParticipantCounts] = useState<{
    [key: string]: number;
  }>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<
    "status" | "difficulty" | "newest" | "participants"
  >("newest");
  const [contestType, setContestType] = useState<"all" | "individual" | "team">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "upcoming" | "running" | "finished"
  >("all");
  const [isTyping, setIsTyping] = useState(false);

  const axiosSecure = useAxiosSecure();
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch contests
        const contestsRes = await axiosSecure.get<Contest[]>("/api/contests");
        const contestsData = contestsRes.data;
        setContests(contestsData);

        console.log("Fetched contests:", contestsData);

        // Try to fetch participant counts, but don't break if it fails
        try {
          const contestIds = contestsData.map((c) => c._id).join(",");
          console.log("Requesting counts for contest IDs:", contestIds);

          const countsRes = await axiosSecure.get(
            `/api/contestParticipants/counts?contestIds=${contestIds}`
          );
          console.log("Counts response:", countsRes.data);

          if (countsRes.data.success) {
            setParticipantCounts(countsRes.data.data);
          } else {
            throw new Error(countsRes.data.message);
          }
        } catch (countsError) {
          console.error("Failed to fetch participant counts:", countsError);
          // Create fallback counts
          const fallbackCounts: { [key: string]: number } = {};
          contestsData.forEach((contest) => {
            fallbackCounts[contest._id] = contest.participants || 0;
          });
          setParticipantCounts(fallbackCounts);
        }
      } catch (err) {
        console.error("Failed to fetch main data:", err);
      } finally {
        setLoading(false);
        setIsTyping(false);
      }
    };
    fetchData();
  }, [axiosSecure]);

  // ---------- Utility functions ----------
  const getStatus = (start: string, end: string) => {
    const now = new Date().getTime();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (now < startTime) return "upcoming";
    if (now > endTime) return "finished";
    return "running";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "from-green-500 to-emerald-500";
      case "upcoming":
        return "from-yellow-500 to-amber-500";
      case "finished":
        return "from-gray-500 to-slate-500";
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500/20 border-green-500/30 text-green-300";
      case "upcoming":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-300";
      case "finished":
        return "bg-gray-500/20 border-gray-500/30 text-gray-300";
      default:
        return "bg-blue-500/20 border-blue-500/30 text-blue-300";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return <FaSeedling className="text-green-400" />;
      case "medium":
        return <FaChartLine className="text-yellow-400" />;
      case "hard":
        return <FaFire className="text-red-400" />;
      default:
        return <FaChartLine className="text-blue-400" />;
    }
  };

  const getContestTypeIcon = (type: string) => {
    return type === "team" ? (
      <FaUsers className="text-purple-400" />
    ) : (
      <FaUser className="text-cyan-400" />
    );
  };

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

  // Calculate total participants across all contests
  const totalParticipants = Object.values(participantCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  // ---------- Filtered + Sorted Contests ----------
  const filteredContests = contests.filter((contest) => {
    const matchesSearch = contest.title
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    const matchesType = contestType === "all" || contest.type === contestType;
    const status = getStatus(contest.startTime, contest.endTime);
    const matchesStatus = statusFilter === "all" || status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedContests = [...filteredContests].sort((a, b) => {
    if (sortOption === "status") {
      const statusOrder: Record<string, number> = {
        running: 0,
        upcoming: 1,
        finished: 2,
      };
      const statusA = getStatus(a.startTime, a.endTime);
      const statusB = getStatus(b.startTime, b.endTime);
      return statusOrder[statusA] - statusOrder[statusB];
    } else if (sortOption === "difficulty") {
      const difficultyRank: Record<string, number> = {
        easy: 1,
        medium: 2,
        hard: 3,
      };
      const maxDifficultyA = Math.max(
        ...a.problems.map(
          (p) => difficultyRank[p.difficulty.toLowerCase()] || 0
        )
      );
      const maxDifficultyB = Math.max(
        ...b.problems.map(
          (p) => difficultyRank[p.difficulty.toLowerCase()] || 0
        )
      );
      return maxDifficultyB - maxDifficultyA;
    } else if (sortOption === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === "participants") {
      const countA = participantCounts[a._id] || 0;
      const countB = participantCounts[b._id] || 0;
      return countB - countA;
    }
    return 0;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsTyping(true);
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
            <EmojiEvents className="text-yellow-400" />
            <span className="text-lg font-semibold text-white/90">
              Coding Competitions
            </span>
          </motion.div>

          <Typography
            variant="h2"
            className="text-center font-bold mb-6 !text-4xl md:!text-6xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            Join Exciting{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Contests
            </span>
          </Typography>

          <Typography
            variant="h6"
            className="text-center text-gray-300 !mt-6 max-w-3xl mx-auto !text-xl leading-relaxed"
          >
            Compete with developers worldwide, test your skills, and climb the
            leaderboard in our diverse range of coding competitions.
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
            {
              icon: <EmojiEvents className="text-2xl" />,
              number: contests.length,
              label: "Total Contests",
              color: "text-cyan-400",
            },
            {
              icon: <People className="text-2xl" />,
              number: totalParticipants,
              label: "Total Participants",
              color: "text-purple-400",
            },
            {
              icon: <Code className="text-2xl" />,
              number: "3",
              label: "Contest Types",
              color: "text-yellow-400",
            },
            {
              icon: <Schedule className="text-2xl" />,
              number: "24/7",
              label: "Available",
              color: "text-green-400",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm"
            >
              <div className={`${stat.color} mb-2 flex justify-center`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.number}
              </div>
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
            {/* Search Input */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search contests..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              />
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

            {/* Contest Type Filter */}
            <select
              value={contestType}
              onChange={(e) => setContestType(e.target.value as any)}
              className="px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <option value="all" className="bg-slate-900">
                All Types
              </option>
              <option value="individual" className="bg-slate-900">
                👤 Individual
              </option>
              <option value="team" className="bg-slate-900">
                👥 Team
              </option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <option value="all" className="bg-slate-900">
                All Status
              </option>
              <option value="upcoming" className="bg-slate-900">
                🟡 Upcoming
              </option>
              <option value="running" className="bg-slate-900">
                🟢 Running
              </option>
              <option value="finished" className="bg-slate-900">
                ⚫ Finished
              </option>
            </select>

            {/* Sort By */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <option value="newest" className="bg-slate-900">
                Newest First
              </option>
              <option value="status" className="bg-slate-900">
                By Status
              </option>
              <option value="difficulty" className="bg-slate-900">
                By Difficulty
              </option>
              <option value="participants" className="bg-slate-900">
                By Participants
              </option>
            </select>
          </div>
        </motion.div>

        {/* Contests Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 relative z-10"
        >
          <AnimatePresence>
            {sortedContests.map((contest, index) => {
              const status = getStatus(contest.startTime, contest.endTime);
              const timeRemaining = getTimeRemaining(contest.startTime);
              const participantCount = participantCounts[contest._id] || 0;

              return (
                <motion.div
                  key={contest._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  {/* Contest Card */}
                  <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 h-full transition-all duration-500 group-hover:border-cyan-500/30">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                    <div className="relative z-10 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getContestTypeIcon(contest.type)}
                          <span className="text-sm text-cyan-300 font-medium uppercase">
                            {contest.type}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${getStatusBg(status)}`}
                        >
                          {status.toUpperCase()}
                        </div>
                      </div>

                      {/* Title */}
                      <Typography
                        variant="h6"
                        className="font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2"
                      >
                        {contest.title}
                      </Typography>

                      {/* Description */}
                      {contest.description && (
                        <Typography
                          variant="body2"
                          className="text-gray-300 mb-4 line-clamp-2 leading-relaxed"
                        >
                          {contest.description}
                        </Typography>
                      )}

                      {/* Time Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-3 text-sm">
                          <FaCalendarAlt className="text-purple-400 text-sm" />
                          <span className="text-gray-300">
                            Starts:{" "}
                            {new Date(contest.startTime).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <FaClock className="text-yellow-400 text-sm" />
                          <span className="text-gray-300">{timeRemaining}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Code className="text-blue-400 text-sm" />
                            <span className="text-sm text-gray-300">
                              {contest.problems.length} Problems
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaUsers className="text-green-400 text-sm" />
                            <span className="text-sm text-gray-300">
                              {participantCount} Participants
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Difficulty & CTA */}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDifficultyIcon(
                            contest.problems[0]?.difficulty || "medium"
                          )}
                          <span className="text-xs text-gray-400">
                            {contest.problems
                              .map((p) => p.difficulty)
                              .filter((v, i, a) => a.indexOf(v) === i)
                              .join(", ")}
                          </span>
                        </div>

                        <motion.a
                          href={`/contests/${contest._id}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r ${getStatusColor(status)} hover:shadow-2xl transition-all duration-300 flex items-center gap-2 text-sm`}
                        >
                          <FaRocket className="text-xs" />
                          {status === "running" ? "Join Now" : "View Details"}
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* No Results Message */}
        {sortedContests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <Typography variant="h5" className="text-white mb-2">
              No contests found
            </Typography>
            <Typography variant="body1" className="text-gray-400">
              Try adjusting your search criteria or filters
            </Typography>
          </motion.div>
        )}
      </Container>
    </div>
  );
};

export default AllContests;
