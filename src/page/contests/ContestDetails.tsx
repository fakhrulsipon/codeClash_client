import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import Modal from "react-modal";
import { AuthContext } from "../../provider/AuthProvider";
import toast from "react-hot-toast";
import ContestLeaderboard from "./ContestLeaderboard";
import LoadingSpinner from "../../components/LoadingSpinner";
import Swal from "sweetalert2";
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  Code,
  Award,
  ChevronRight,
  Star,
  Target,
  Zap,
  Crown,
  Sparkles,
  Swords,
  Shield,
  Medal,
} from "lucide-react";
import useAxiosPublic from "../../hook/useAxiosPublic";
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
  type: string;
  problems: Problem[];
  description?: string;
  createdAt?: string;
};

type LeaderboardUser = {
  _id: string;
  userName: string;
  userImage?: string;
  totalPoints: number;
};

const ContestDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext)!;

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [teamName, setTeamName] = useState("");

  // Modals
  const [modalIndividual, setModalIndividual] = useState(false);
  const [modalTeam, setModalTeam] = useState(false);
  const [leaderboardModal, setLeaderboardModal] = useState(false);

  // Team inputs
  const [teamCode, setTeamCode] = useState("");

  // Loading states
  const [actionLoading, setActionLoading] = useState(false);

  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  // Fetch contest data
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axiosPublic.get<Contest>(`/api/contests/${id}`);
        setContest(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        setLeaderboardLoading(true);
        const res = await axiosPublic.get(
          `/api/contestSubmissions/leaderboard/${id}`
        );
        setLeaderboard(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLeaderboardLoading(false);
      }
    };

    fetchContest();
    fetchLeaderboard();
  }, [id, axiosPublic]);

  // Countdown timer
  useEffect(() => {
    if (!contest) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(contest.startTime).getTime();
      const end = new Date(contest.endTime).getTime();
      let distance: number;
      let prefix: string;

      if (now < start) {
        distance = start - now;
        prefix = "Starts in: ";
      } else if (now >= start && now <= end) {
        distance = end - now;
        prefix = "Ends in: ";
      } else {
        setTimeLeft("Contest ended");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        days > 0
          ? `${prefix}${days}d ${hours}h ${minutes}m ${seconds}s`
          : `${prefix}${hours}h ${minutes}m ${seconds}s`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  // Handle modal close
  const handleModalClose = () => {
    setModalTeam(false);
    setTeamName("");
    setTeamCode("");
  };

  // Handle join contest
  const handleJoinContest = async () => {
    if (!user) {
      toast.error("Please log in to join the contest");
      navigate("/login");
      return;
    }

    if (contest?.type === "individual") {
      setModalIndividual(true);
    } else {
      setModalTeam(true);
    }
  };

  // Create team function - UPDATED to handle both manual and auto-generated names
  const handleCreateTeam = async () => {
    try {
      setActionLoading(true);

      const res = await axiosSecure.post("/api/teams/quick-create", {
        contestId: contest?._id,
        userId: user.uid,
        userName: user.displayName || "Coder",
        userImage: user.photoURL || "",
        teamName: teamName.trim(), // Send empty string if no name provided
      });

      if (res.data.success) {
        toast.success("🎉 Team Created Successfully!");
        navigate(
          `/contests/${contest?._id}/lobby?teamCode=${res.data.teamCode}&newTeam=true`
        );
      } else {
        toast.error(res.data.message || "Failed to create team");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create team");
    } finally {
      setActionLoading(false);
    }
  };

  // Quick create team with auto-generated name
  const handleQuickCreateTeam = async () => {
    try {
      setActionLoading(true);

      const res = await axiosSecure.post("/api/teams/quick-create", {
        contestId: contest?._id,
        userId: user.uid,
        userName: user.displayName || "Coder",
        userImage: user.photoURL || "",
        // No teamName provided - backend will auto-generate
      });

      if (res.data.success) {
        toast.success("🎉 Team Created Successfully!");
        navigate(
          `/contests/${contest?._id}/lobby?teamCode=${res.data.teamCode}&newTeam=true`
        );
      } else {
        toast.error(res.data.message || "Failed to create team");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create team");
    } finally {
      setActionLoading(false);
    }
  };

  // Join team function
  const handleJoinTeam = async () => {
    if (!teamCode.trim()) {
      toast.error("Please enter a team code");
      return;
    }

    try {
      setActionLoading(true);

      const res = await axiosSecure.post("/api/teams/join", {
        code: teamCode.trim().toUpperCase(),
        userId: user.uid,
        userName: user.displayName || "Coder",
        userImage: user.photoURL || "",
      });

      if (res.data.success) {
        toast.success("🎉 Successfully joined the team!");
        handleModalClose();
        navigate(
          `/contests/${contest?._id}/lobby?teamCode=${teamCode.trim().toUpperCase()}`
        );
      } else {
        toast.error(res.data.message || "Failed to join team");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to join team");
    } finally {
      setActionLoading(false);
    }
  };

  // Individual contest join
  const confirmJoinIndividual = async () => {
    if (!user) {
      toast.error("Please log in to join the contest");
      return navigate("/login");
    }

    try {
      await axiosSecure.post("/api/contestParticipants", {
        contestId: contest?._id,
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        type: "individual",
      });

      toast.success("You have successfully joined the contest!");
      setModalIndividual(false);
      navigate(`/contests/${contest?._id}/lobby`);
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("You already joined this contest!");
      } else {
        toast.error("Failed to join. Please try again.");
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!contest)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-24 h-24 mx-auto mb-6 text-purple-400">
            <Target className="w-full h-full opacity-60" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Contest Not Found
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            The contest you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/contests")}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:from-purple-500 hover:to-pink-500"
          >
            Browse Contests
          </button>
        </div>
      </div>
    );

  const now = new Date().getTime();
  const start = new Date(contest.startTime).getTime();
  const end = new Date(contest.endTime).getTime();
  const status: "Upcoming" | "Running" | "Finished" =
    now < start ? "Upcoming" : now > end ? "Finished" : "Running";

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "from-green-500 to-emerald-400";
      case "medium":
        return "from-yellow-500 to-orange-400";
      case "hard":
        return "from-red-500 to-pink-400";
      default:
        return "from-gray-500 to-gray-400";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "Running":
        return "from-green-500 to-emerald-400";
      case "Upcoming":
        return "from-blue-500 to-cyan-400";
      case "Finished":
        return "from-gray-500 to-gray-400";
      default:
        return "from-purple-500 to-pink-400";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "Running":
        return <Zap className="w-4 h-4" />;
      case "Upcoming":
        return <Clock className="w-4 h-4" />;
      case "Finished":
        return <Shield className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-purple-500/30 mb-8">
            <div
              className={`w-3 h-3 rounded-full bg-gradient-to-r ${getStatusColor()} animate-pulse`}
            ></div>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-semibold text-white capitalize">
                {status} Contest
              </span>
            </div>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent mb-6 leading-tight">
            {contest.title}
          </h1>

          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              {contest.description ||
                "Compete with top developers in this exciting coding challenge. Showcase your skills and climb the leaderboard!"}
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-3 text-gray-300">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="font-semibold capitalize">{contest.type}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Code className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">
                  {contest.problems.length} Problems
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">Top 10 Win Prizes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contest Stats Card */}
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl border border-purple-500/20">
                  <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-300 mb-1">
                    Start Time
                  </h3>
                  <p className="text-lg font-bold text-white">
                    {new Date(contest.startTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-purple-300">
                    {new Date(contest.startTime).toLocaleTimeString()}
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-2xl border border-blue-500/20">
                  <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-300 mb-1">End Time</h3>
                  <p className="text-lg font-bold text-white">
                    {new Date(contest.endTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-blue-300">
                    {new Date(contest.endTime).toLocaleTimeString()}
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-2xl border border-green-500/20">
                  <Zap className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-300 mb-1">
                    Time Left
                  </h3>
                  <p className="text-lg font-bold text-white">{timeLeft}</p>
                  <p className="text-sm text-green-300 capitalize">{status}</p>
                </div>
              </div>
            </div>

            {/* Problems Section */}
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                  <Swords className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Contest Challenges
                  </h2>
                  <p className="text-gray-400">
                    Test your skills with these coding problems
                  </p>
                </div>
                <span className="ml-auto px-4 py-2 bg-purple-900/50 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                  {contest.problems.length} problems
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {contest.problems.map((problem, index) => (
                  <div
                    key={problem._id}
                    className="group p-6 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                              {problem.title}
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                              {problem.category}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-400 mb-4 line-clamp-2">
                          {problem.description}
                        </p>

                        <div className="flex gap-3">
                          <span
                            className={`px-4 py-2 bg-gradient-to-r ${getDifficultyColor(problem.difficulty)} text-white rounded-full text-xs font-bold capitalize shadow-lg`}
                          >
                            {problem.difficulty}
                          </span>
                          <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs font-bold shadow-lg">
                            {problem.category}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Action Card */}
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ready to Compete?
                </h3>
                <p className="text-purple-200 opacity-90">
                  {contest.type === "team"
                    ? "Create a team or join an existing one!"
                    : "Join individually and showcase your skills!"}
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setLeaderboardModal(true)}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
                >
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-white">
                    View Leaderboard
                  </span>
                </button>

                <button
                  disabled={status === "Finished" || actionLoading}
                  onClick={handleJoinContest}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                    status === "Finished"
                      ? "bg-gray-600 cursor-not-allowed text-gray-400"
                      : actionLoading
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-2xl hover:scale-105 hover:from-green-400 hover:to-emerald-400"
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  {actionLoading
                    ? "Joining..."
                    : status === "Finished"
                      ? "Contest Ended"
                      : `Join ${contest.type === "team" ? "as Team" : "Contest"}`}
                </button>
              </div>

              {/* Team Contest Info */}
              {contest.type === "team" && status !== "Finished" && (
                <div className="mt-4 p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
                  <p className="text-sm text-blue-200 text-center">
                    💡 Team contest: Create a new team or join an existing one
                    with a code!
                  </p>
                </div>
              )}
            </div>

            {/* Leaderboard Preview */}
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Top Performers</h3>
              </div>

              <div className="space-y-4">
                {leaderboardLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No participants yet</p>
                    <p className="text-sm text-gray-600">
                      Be the first to join!
                    </p>
                  </div>
                ) : (
                  leaderboard.slice(0, 5).map((user, index) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-900/50 to-black/50 hover:from-purple-900/30 hover:to-pink-900/30 transition-all duration-200 border border-gray-700 hover:border-purple-500/30"
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                            : index === 1
                              ? "bg-gradient-to-r from-gray-400 to-gray-300 text-gray-900 shadow-md"
                              : index === 2
                                ? "bg-gradient-to-r from-orange-700 to-orange-600 text-white shadow-sm"
                                : "bg-gradient-to-r from-purple-900 to-pink-900 text-gray-300"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <img
                        src={
                          user.userImage ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                        }
                        alt={user.userName}
                        className="w-10 h-10 rounded-full border-2 border-purple-500/50 shadow-lg"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">
                          {user.userName}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <p className="text-sm font-bold text-purple-400">
                            {user.totalPoints} pts
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {leaderboard.length > 5 && (
                <button
                  onClick={() => setLeaderboardModal(true)}
                  className="w-full mt-6 py-3 text-center text-purple-400 font-semibold rounded-xl border border-purple-500/30 hover:bg-purple-900/30 transition-all duration-200 hover:scale-105"
                >
                  View Full Leaderboard
                </button>
              )}
            </div>

            {/* Contest Info */}
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-xl rounded-3xl border border-blue-500/20 p-6">
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <Medal className="w-5 h-5 text-blue-400" />
                Contest Guidelines
              </h4>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Solve problems to earn points</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Higher difficulty = More points</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Time penalties may apply</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Top 10 win amazing prizes</span>
                </li>
                {contest.type === "team" && (
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Team up with friends for better strategy</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Join Modal */}
      <Modal
        isOpen={modalIndividual}
        onRequestClose={() => setModalIndividual(false)}
        overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-2xl max-w-md w-full mx-auto border border-purple-500/30 outline-none"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl">
            <Zap className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Join Individual Contest
          </h2>

          <p className="text-gray-400 mb-6 leading-relaxed">
            You're about to join{" "}
            <span className="font-semibold text-purple-400">
              {contest.title}
            </span>{" "}
            as an individual participant.
          </p>

          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-2xl p-4 mb-6">
            <p className="text-sm text-yellow-200">
              <strong>Note:</strong> Make sure you're ready to compete. The
              timer starts as soon as you join!
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setModalIndividual(false)}
              className="flex-1 px-4 py-3 text-gray-400 font-semibold rounded-xl border border-gray-600 hover:bg-gray-800 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmJoinIndividual}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
            >
              Confirm Join
            </button>
          </div>
        </div>
      </Modal>

      {/* Team Options Modal */}
      <Modal
        isOpen={modalTeam}
        onRequestClose={handleModalClose}
        overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl max-w-2xl w-full mx-auto border border-purple-500/30 outline-none relative max-h-[90vh] my-auto flex flex-col mt-16"
      >
        {/* Close Button - Top Right */}
        <button
          onClick={handleModalClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 z-10"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header - Fixed */}
        <div className="p-6 pb-4 flex-shrink-0">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Team Options</h2>
            <p className="text-gray-400 text-sm">
              Choose how you want to join{" "}
              <span className="font-semibold text-purple-400">
                {contest.title}
              </span>
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Side by side options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Create Team Option */}
            <div className="p-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 h-full flex flex-col">
              <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Create Team</h3>

              {/* Team Name Input */}
              <div className="space-y-2 mb-3 flex-grow">
                <input
                  type="text"
                  placeholder="Enter team name (optional)"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-center text-sm"
                  maxLength={20}
                />
                <p className="text-gray-300 text-xs leading-relaxed">
                  Enter a custom name or leave blank for auto-generated name
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCreateTeam}
                  disabled={actionLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm"
                >
                  {actionLoading ? "Creating..." : "Create Team"}
                </button>

                {/* Quick Create Button */}
                <button
                  onClick={handleQuickCreateTeam}
                  disabled={actionLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm"
                >
                  {actionLoading ? "Creating..." : "Quick Create"}
                </button>
              </div>
            </div>

            {/* Join Team Option */}
            <div className="p-4 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 h-full flex flex-col">
              <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Join Team</h3>
              <p className="text-gray-300 text-xs mb-3 leading-relaxed flex-grow">
                Join with a team code
              </p>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Team code (e.g., A1B2C3)"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-center font-mono text-sm"
                  maxLength={6}
                />
                <button
                  onClick={handleJoinTeam}
                  disabled={actionLoading || !teamCode.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm"
                >
                  {actionLoading ? "Joining..." : "Join Team"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Leaderboard Modal */}
      <Modal
        isOpen={leaderboardModal}
        onRequestClose={() => setLeaderboardModal(false)}
        className="w-[95%] max-w-6xl mx-auto mt-8 bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl outline-none overflow-hidden border border-purple-500/30"
        overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-start z-50 p-4"
      >
        <div className="p-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Contest Leaderboard
                </h2>
                <p className="text-purple-200">Live rankings and scores</p>
              </div>
            </div>
            <button
              onClick={() => setLeaderboardModal(false)}
              className="p-3 hover:bg-white/10 rounded-2xl transition-colors border border-white/10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-auto">
          <ContestLeaderboard contestId={contest._id} />
        </div>

        <div className="p-6 border-t border-gray-700 bg-black/50 rounded-b-3xl">
          <button
            onClick={() => setLeaderboardModal(false)}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
          >
            Close Leaderboard
          </button>
        </div>
      </Modal>
    </div>
  );
};

// Add X icon component
const X: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default ContestDetails;
