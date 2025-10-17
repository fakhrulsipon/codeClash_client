import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import Modal from "react-modal";
import { AuthContext } from "../../provider/AuthProvider";
import toast from "react-hot-toast";
import ContestLeaderboard from "./ContestLeaderboard";
import LoadingSpinner from "../../components/LoadingSpinner";
import createIcon from "../../assets/create_icon.png";
import groupIcon from "../../assets/group_icon.png";
import Swal from "sweetalert2";
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
  type: string; // "individual" or "team"
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
  const { user } = useContext(AuthContext);

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Modals
  const [modalIndividual, setModalIndividual] = useState(false);
  const [modalTeam, setModalTeam] = useState(false);
  const [leaderboardModal, setLeaderboardModal] = useState(false);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  // Team inputs
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [teamJoined, setTeamJoined] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Fetch contest data
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axiosSecure.get<Contest>(
          `/api/contests/${id}`
        );
        setContest(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await axiosSecure.get(`/api/contestSubmissions/leaderboard/${id}`);
        setLeaderboard(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLeaderboardLoading(false);
      }
    };

    fetchContest();
    fetchLeaderboard();
  }, [id]);

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

  if (loading) return <LoadingSpinner />;
  if (!contest)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        Contest not found.
      </p>
    );

  const now = new Date().getTime();
  const start = new Date(contest.startTime).getTime();
  const end = new Date(contest.endTime).getTime();
  const status: "Upcoming" | "Running" | "Finished" =
    now < start ? "Upcoming" : now > end ? "Finished" : "Running";

  // -------------------
  // Join handlers
  // -------------------

  const handleJoinClick = () => {
    if (!user) {
      toast.error("Please log in to join the contest");
      navigate("/login");
      return;
    }

    if ((contest.type || "individual").toLowerCase() === "individual") {
      setModalIndividual(true);
    } else {
      setModalTeam(true);
    }
  };

  const confirmJoinIndividual = async () => {
    if (!user) {
      toast.error("Please log in to join the contest");
      return navigate("/login");
    }

    try {
      await axiosSecure.post("/api/contestParticipants", {
        contestId: contest._id,
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        type: "individual",
      });

      toast.success("You have successfully joined the contest!");
      setModalIndividual(false);

      navigate(`/contests/${contest._id}/lobby`);
      setTimeout(() => {
        navigate(`/contests/${contest._id}/workspace`);
      }, 5000);
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 409) {
        toast.error("You already joined this contest!");
      } else {
        toast.error("Failed to join. Please try again.");
      }
    }
  };

  // creating team

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Enter a team name",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    if (!user) {
      toast.error("Please log in to create a team");
      navigate("/login");
      return;
    }

    try {
      await axiosSecure.post("/api/teams", {
        name: teamName,
        contestId: contest._id,
        userId: user.uid,
        userName: user.displayName || "Unknown User",
        userImage: user.photoURL || "",
      });

      toast.success("Team created successfully!");
      setTeamJoined(true);
      setModalTeam(false);

      Swal.fire({
        icon: "success",
        title: "Team Created!",
        text: `Share this team code with others: ${res.data.teamCode}`,
        confirmButtonColor: "#7c3aed",
      });

      // Navigate with team code to ensure we get the right team
      navigate(`/contests/${contest._id}/lobby?teamCode=${res.data.teamCode}`);
    } catch (error: any) {
      console.error("Team creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create team");
    }
  };

  // joining team
  const handleJoinTeam = async () => {
    if (!teamCode.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Enter a team code",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    if (!user) {
      toast.error("Please log in to join a team");
      navigate("/login");
      return;
    }

    try {
      await axiosSecure.post("/api/teams/join", {
        code: teamCode.trim(),
        userId: user.uid, 
        userName: user.displayName || "Unknown User",
        userImage: user.photoURL || "",
      });

      toast.success(res.data.message);
      setTeamJoined(true);
      setModalTeam(false);

      navigate(`/contests/${contest._id}/lobby`);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to join the team. Try again."
      );
    }
  };

  return (
    <div className="container mx-auto p-8 lg:py-12 flex flex-col lg:flex-row gap-8 min-h-screen">
      {/* Left/Main Content */}
      <div className="lg:w-2/3 space-y-8">
        {/* Contest Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {contest.title}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Compete with other developers in this coding challenge. The top 10
            participants will receive prizes.
          </p>
        </div>

        {/* Contest Details */}
        <div className="p-6 rounded-lg space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Contest Details
          </h2>
          {contest.description && (
            <p className="text-gray-600 dark:text-gray-400">
              {contest.description}
            </p>
          )}
          <div>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Type:</strong> {contest.type} | <strong>Created:</strong>{" "}
              {contest.createdAt
                ? new Date(contest.createdAt).toLocaleDateString()
                : ""}
            </p>
            <p className=" text-gray-700 dark:text-gray-300">
              <strong>Start:</strong>{" "}
              {new Date(contest.startTime).toLocaleString()} |{" "}
              <strong>End:</strong> {new Date(contest.endTime).toLocaleString()}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              <strong>Time Left:</strong> {timeLeft}
            </p>
          </div>
        </div>

        {/* Problems */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Problems
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {contest.problems.map((p) => (
              <div
                key={p._id}
                className="p-4 bg-white/30 dark:bg-gray-800/40 text-gray-800 dark:text-gray-200 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
              >
                <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
                <p className="text-sm mb-2">{p.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-blue-200 text-blue-900 rounded-full text-xs font-medium">
                    Difficulty: {p.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-purple-200 text-purple-900 rounded-full text-xs font-medium">
                    Category: {p.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setLeaderboardModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            View Leaderboard
          </button>

          <button
            disabled={status === "Finished"}
            onClick={handleJoinClick}
            className={`px-6 py-3 rounded-lg font-bold transition-colors ${
              status === "Finished"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-purple-700 hover:scale-105 hover:shadow-md"
            }`}
          >
            {status === "Finished" ? "Contest Ended" : "Join Contest"}
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="space-y-8 lg:mt-24 lg:w-1/3">
        <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-xl text-center font-bold text-gray-900 dark:text-white mb-4">
            Live Standings
          </h3>

          <div className="space-y-4">
            {leaderboardLoading ? (
              <p>Loading...</p>
            ) : leaderboard.length === 0 ? (
              <p>No participants yet.</p>
            ) : (
              leaderboard.slice(0, 5).map((u, index) => (
                <div key={u._id} className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-8 text-lg font-bold ${
                      index < 3
                        ? "text-gray-600 dark:text-gray-300"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {index + 1}.
                  </div>
                  <img
                    src={
                      u.userImage ||
                      "https://i.ibb.co/Mk8SW7Cn/Whats-App-Image-2025-08-08-at-17-30-41-9e269935.jpg" +
                        u._id
                    }
                    alt={u.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {u.userName}
                    </p>
                    <p
                      className={`text-sm ${
                        index < 3
                          ? "text-primary"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {u.totalPoints} points
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Individual Join Modal */}
      <Modal
        isOpen={modalIndividual}
        onRequestClose={() => setModalIndividual(false)}
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        className="bg-gradient-to-tr from-purple-400 via-pink-300 to-indigo-400 rounded-3xl p-8 shadow-2xl max-w-md mx-auto relative animate-fade-in"
      >
        <button
          onClick={() => setModalIndividual(false)}
          className="absolute top-4 right-4 text-white font-bold text-xl hover:text-gray-200"
        >
          &times;
        </button>
        <div className="text-center text-gray-200">
          <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow-lg">
            {contest.title}
          </h2>
          <p className="text-white/90 mb-6 text-lg">
            You are about to join this individual contest. Make sure you are
            ready to compete!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setModalIndividual(false)}
              className="px-5 py-2 rounded-full bg-white/30 text-white font-semibold hover:bg-white/50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmJoinIndividual}
              className="px-5 py-2 rounded-full bg-white text-purple-700 font-bold hover:scale-105 hover:shadow-lg transition-all duration-200"
            >
              Confirm Join
            </button>
          </div>
        </div>
      </Modal>
      {/* Team Join Modal */}
      <Modal
        isOpen={modalTeam}
        onRequestClose={() => setModalTeam(false)}
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        className="bg-gradient-to-tr from-purple-400 via-pink-300 to-indigo-400 rounded-3xl px-6 sm:p-8 shadow-2xl max-w-full sm:max-w-xl md:max-w-2xl mx-auto relative overflow-auto max-h-[90vh] animate-fade-in mt-32 md:mt-20"
      >
        {/* Close Button */}
        <button
          onClick={() => setModalTeam(false)}
          className="absolute top-4 right-4 text-white font-bold text-xl hover:text-gray-200"
        >
          &times;
        </button>

        {/* Modal Header */}
        <div className="text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 drop-shadow-lg">
            Join as a Team
          </h2>
          <p className="text-white/90 mb-6 text-base sm:text-lg">
            You can create a new team or join an existing one to participate in
            this contest.
          </p>
        </div>

        {/* Create / Join Team Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Create Team */}
          <div className="flex flex-col items-center p-4 sm:p-6 bg-white/20 rounded-xl border border-white/30 hover:border-white/50 transition-colors w-full">
            <img className="h-12 sm:h-16" src={createIcon} alt="Create Team" />
            <h3 className="font-bold text-xl sm:text-2xl text-white mb-2">
              Create a Team
            </h3>
            <p className="text-sm sm:text-base text-center text-white/80 mb-4">
              Form a new team and invite your friends to join.
            </p>
            <input
              placeholder="Team Name"
              className="w-full p-2 rounded-lg bg-white/30 text-white placeholder-white/70 border border-white/50 mb-2 focus:outline-none focus:ring-2 focus:ring-white/50"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <button
              onClick={handleCreateTeam}
              className="w-full bg-white text-purple-700 font-bold py-2 px-4 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-200"
            >
              Create Team
            </button>
          </div>

          {/* Join Team */}
          <div className="flex flex-col items-center p-4 sm:p-6 bg-white/20 rounded-xl border border-white/30 hover:border-white/50 transition-colors w-full mb-4 lg:mb-0">
            <img className="h-12 sm:h-16" src={groupIcon} alt="Join Team" />
            <h3 className="font-bold text-xl sm:text-2xl text-white mb-2">
              Join a Team
            </h3>
            <p className="text-sm sm:text-base text-center text-white/80 mb-4">
              Enter an invitation code to join an existing team.
            </p>
            <input
              placeholder="Enter Team Code"
              className="w-full p-2 rounded-lg bg-white/30 text-white placeholder-white/70 border border-white/50 mb-2 focus:outline-none focus:ring-2 focus:ring-white/50"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
            />

            <button
              onClick={handleJoinTeam}
              className="w-full bg-white text-purple-700 font-bold py-2 px-4 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-200"
            >
              Join Team
            </button>
          </div>
        </div>
      </Modal>

      {/* Leaderboard Modal */}
      <Modal
        isOpen={leaderboardModal}
        onRequestClose={() => setLeaderboardModal(false)}
        className="w-[95%] max-w-6xl mx-auto mt-16 md:mt-24 bg-gradient-to-tr from-purple-400 via-pink-300 to-indigo-400 p-6 sm:p-10 rounded-3xl shadow-2xl outline-none overflow-auto animate-fade-in"
        overlayClassName="fixed inset-0 bg-black/60 flex justify-center items-start z-50 backdrop-blur-sm"
      >
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center drop-shadow-lg">
            Contest Leaderboard
          </h2>

          <div className="rounded-2xl bg-white/10 p-4 sm:p-6 shadow-inner backdrop-blur-sm">
            <ContestLeaderboard contestId={contest._id} />
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setLeaderboardModal(false)}
              className="px-8 py-3 rounded-full bg-white/30 text-white font-semibold hover:bg-white/50 hover:scale-105 transition-all duration-200 shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContestDetails;
