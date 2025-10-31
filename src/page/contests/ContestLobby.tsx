import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hook/useAxiosSecure";
import useAxiosPublic from "../../hook/useAxiosPublic";
import { Users } from "lucide-react";

interface Contest {
  _id: string;
  title: string;
  type: "individual" | "team";
  description?: string;
  startTime: string;
  endTime: string;
  problems: any[];
}

interface TeamMember {
  userId: string;
  userName: string;
  userImage?: string;
  role: "leader" | "member";
  ready: boolean;
  joinedAt: string;
}

interface Team {
  _id: string;
  code: string;
  name: string;
  createdBy: string;
  members: TeamMember[];
  status: "waiting" | "ready" | "started";
  contestId: string;
}

const ContestLobby: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext)!;
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [contest, setContest] = useState<Contest | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch contest info
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const { data } = await axiosPublic.get(`/api/contests/${contestId}`);
        setContest(data);
      } catch (error) {
        toast.error("Failed to load contest");
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
  }, [axiosPublic, contestId]);

  // Handle new team modal - RUN ONLY ONCE
  useEffect(() => {
    const isNewTeam = searchParams.get("newTeam") === "true";
    if (isNewTeam) {
      setShowShareModal(true);
      // Clean URL immediately
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []); // Empty dependency array - runs only once on mount

  // Fetch team info and handle auto-join - RUN ONLY ONCE
  useEffect(() => {
    if (contest?.type === "team" && user?.uid && !team) {
      const fetchTeamAndHandleJoin = async () => {
        try {
          setTeamLoading(true);

          const joinCode = searchParams.get("join");

          // Handle auto-join from invite link
          if (joinCode) {
            try {
              const res = await axiosSecure.post("/api/teams/join", {
                code: joinCode,
                userId: user.uid,
                userName: user.displayName || "Coder",
                userImage: user.photoURL || "",
              });

              if (res.data.success) {
                toast.success("🎉 Successfully joined the team!");
              }
            } catch (error: any) {
              if (error.response?.status !== 409) {
                toast.error(
                  error.response?.data?.message || "Failed to join team"
                );
              }
            }
          }

          // Get team data
          let url;
          if (joinCode) {
            url = `/api/teams/code/${joinCode}`;
          } else {
            url = `/api/teams/user/${user.uid}?contestId=${contestId}`;
          }

          const { data } = await axiosPublic.get(url);
          setTeam(data);

          // Redirect if contest started
          if (data.status === "started") {
            toast.success("Contest started! Redirecting...");
            navigate(`/contests/${contestId}/workspace`);
          }
        } catch (error: any) {
          if (error.response?.status !== 404) {
            toast.error("Failed to load team information");
          }
        } finally {
          setTeamLoading(false);
        }
      };

      fetchTeamAndHandleJoin();
    }
  }, [
    contest,
    contestId,
    user,
    navigate,
    searchParams,
    axiosSecure,
    axiosPublic,
  ]); // Removed 'team' from dependencies

  // Countdown for individual contests
  useEffect(() => {
    if (contest?.type === "individual") {
      if (timeLeft === 0) {
        navigate(`/contests/${contestId}/workspace`);
        return;
      }
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, contest, contestId, navigate]);

  const handleReadyToggle = async () => {
    if (!team || !user?.uid) return;

    try {
      const member = team.members.find((m) => m.userId === user.uid);
      if (!member) return;

      const { data } = await axiosSecure.patch(
        `/api/teams/${team.code}/ready`,
        {
          userId: user.uid,
          ready: !member.ready,
        }
      );
      setTeam(data);
      toast.success(!member.ready ? "You are ready!" : "You are not ready");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update ready status"
      );
    }
  };

  const handleStartContest = async () => {
    if (!team || !user?.uid) return;

    try {
      const { data } = await axiosSecure.patch(
        `/api/teams/${team.code}/start`,
        {
          userId: user.uid,
        }
      );
      setTeam(data.team);
      toast.success("Contest started! Redirecting...");
      setTimeout(() => navigate(`/contests/${contestId}/workspace`), 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to start contest");
    }
  };

  const handleCopyTeamCode = () => {
    if (team?.code) {
      navigator.clipboard.writeText(team.code);
      toast.success("Team code copied to clipboard!");
    }
  };

  const handleInviteTeammates = () => {
    setShowShareModal(true);
  };

  // Refresh team data manually when needed
  const refreshTeamData = async () => {
    if (!team) return;

    try {
      const { data } = await axiosPublic.get(`/api/teams/code/${team.code}`);
      setTeam(data);
    } catch (error) {
      console.error("Failed to refresh team data");
    }
  };

  const currentUserMember = team?.members?.find((m) => m.userId === user?.uid);
  const isLeader =
    currentUserMember?.role === "leader" || team?.createdBy === user?.uid;
  const allReady = team?.members?.every((m) => m.ready) ?? false;
  const currentUserReady = currentUserMember?.ready ?? false;
  const readyMembersCount = team?.members?.filter((m) => m.ready).length ?? 0;
  const totalMembersCount = team?.members?.length ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Contest Not Found
          </h2>
          <button
            onClick={() => navigate("/contests")}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Contests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {" "}
      {/* Added pt-16 for navbar spacing */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {contest.title}
          </h1>
          <div className="flex justify-center items-center gap-4 text-lg text-gray-300">
            <span className="px-3 py-1 bg-white/10 rounded-full shadow-sm">
              {contest.type === "individual"
                ? "Individual Contest"
                : "Team Contest"}
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full shadow-sm">
              Starts: {new Date(contest.startTime).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-3xl p-8 shadow-2xl text-white">
          {/* Countdown/Room Status */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {contest.type === "individual"
                ? "Get Ready! Starting in..."
                : "Team Lobby"}
            </h2>

            {contest.type === "individual" ? (
              <div className="text-6xl font-mono font-bold bg-white/20 rounded-2xl p-6 inline-block">
                {timeLeft}s
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="text-3xl font-mono font-bold bg-white/20 rounded-xl px-6 py-3">
                  Status:{" "}
                  {team?.status ? team.status.toUpperCase() : "LOADING..."}
                </div>
                {team && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3">
                      <span>Team: </span>
                      <strong className="text-xl">{team.name}</strong>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3">
                      <span>Team Code: </span>
                      <code className="font-mono text-2xl font-bold bg-white/30 px-3 py-1 rounded">
                        {team.code}
                      </code>
                      <button
                        onClick={handleCopyTeamCode}
                        className="ml-2 px-3 py-1 bg-white/30 hover:bg-white/40 rounded text-sm transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    {isLeader && (
                      <div className="bg-yellow-400/30 text-yellow-100 px-4 py-2 rounded-lg flex items-center gap-2">
                        👑 You are the Team Leader
                        <button
                          onClick={handleInviteTeammates}
                          className="ml-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          Invite Teammates
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Team Management Section */}
          {contest.type === "team" && (
            <div className="space-y-6">
              {/* Team Members */}
              {teamLoading ? (
                <div className="flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : team ? (
                <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-4 text-center">
                    Team Members ({team.members?.length || 0})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {team.members?.map((member, index) => (
                      <div
                        key={member.userId}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          member.ready
                            ? "bg-green-500/30 border-green-400"
                            : "bg-white/10 border-white/20"
                        } ${
                          member.userId === user?.uid
                            ? "ring-2 ring-yellow-400"
                            : ""
                        } ${member.role === "leader" ? "border-yellow-400 shadow-lg" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                member.role === "leader"
                                  ? "bg-yellow-400 text-black"
                                  : "bg-white/20"
                              }`}
                            >
                              {member.role === "leader" ? "👑" : index + 1}
                            </div>
                            <div>
                              <p className="font-semibold flex items-center gap-2">
                                {member.userName}
                                {member.userId === user?.uid && (
                                  <span className="text-yellow-300">(You)</span>
                                )}
                              </p>
                              <p className="text-sm opacity-80 capitalize">
                                {member.role} •{" "}
                                {member.ready ? "Ready ✅" : "Not Ready ❌"}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full ${
                              member.ready ? "bg-green-400" : "bg-red-400"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center bg-white/20 rounded-2xl p-8">
                  <LoadingSpinner />
                  <p className="mt-2">Loading team information...</p>
                </div>
              )}

              {/* Action Buttons */}
              {team && currentUserMember && (
                <div className="flex flex-col items-center gap-4">
                  {/* Ready Button for ALL users (including leader) */}
                  <button
                    onClick={handleReadyToggle}
                    className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
                      currentUserReady
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    } hover:scale-105 shadow-lg`}
                  >
                    {currentUserReady ? "Mark as Not Ready" : "I'm Ready!"}
                  </button>

                  {/* Additional buttons for leader */}
                  {isLeader && (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex gap-3">
                        <button
                          onClick={handleInviteTeammates}
                          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          Invite More
                        </button>
                        <button
                          onClick={handleStartContest}
                          disabled={!allReady || totalMembersCount === 1}
                          className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
                            allReady && totalMembersCount > 1
                              ? "bg-green-500 hover:bg-green-600 text-white hover:scale-105 shadow-lg"
                              : "bg-gray-400 text-gray-200 cursor-not-allowed"
                          }`}
                        >
                          {allReady && totalMembersCount > 1
                            ? "🎯 Start Contest Now!"
                            : totalMembersCount === 1
                              ? "Need more team members..."
                              : "Waiting for members to be ready..."}
                        </button>
                      </div>

                      {/* Ready status info */}
                      <div className="text-center">
                        <p className="text-sm opacity-80">
                          {readyMembersCount} of {totalMembersCount} members
                          ready
                        </p>
                        {totalMembersCount === 1 && (
                          <p className="text-sm text-yellow-300 mt-1">
                            💡 Invite more teammates to start the contest!
                          </p>
                        )}
                        {totalMembersCount > 1 && !allReady && (
                          <p className="text-sm text-yellow-300 mt-1">
                            All team members must be ready to start
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Contest Description */}
          {contest.description && (
            <div className="mt-8 bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3">Contest Rules & Notes</h3>
              <p className="leading-relaxed">{contest.description}</p>
            </div>
          )}

          {/* Individual Contest Info */}
          {contest.type === "individual" && (
            <div className="text-center mt-6">
              <p className="text-lg opacity-90">
                You will be automatically redirected to the workspace when the
                countdown ends.
              </p>
              <p className="text-sm opacity-70 mt-2">
                Make sure you have a stable internet connection and are ready to
                code!
              </p>
            </div>
          )}
        </div>

        {/* Problems Preview */}
        {contest.problems && contest.problems.length > 0 && (
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Problems Preview ({contest.problems.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contest.problems.slice(0, 4).map((problem, index) => (
                <div
                  key={problem._id}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg"
                >
                  <h4 className="font-semibold text-white">
                    Problem {index + 1}: {problem.title}
                  </h4>
                  <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                    {problem.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        problem.difficulty === "Easy"
                          ? "bg-green-500/20 text-green-300"
                          : problem.difficulty === "Medium"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                      {problem.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Team Share Modal */}
      <TeamShareModal
        team={team}
        contest={contest}
        onClose={() => setShowShareModal(false)}
        isOpen={showShareModal}
      />
    </div>
  );
};

// Team Share Modal Component
const TeamShareModal = ({ team, contest, onClose, isOpen }) => {
  if (!isOpen || !team) return null;

  const inviteLink = `http://localhost:5173/contests/${contest._id}?join=${team.code}`;

  const shareMethods = [
    {
      name: "Copy Invite Link",
      icon: "🔗",
      action: async () => {
        await navigator.clipboard.writeText(inviteLink);
        toast.success("Invite link copied! Share it with your teammates.");
      },
      description: "Share this link anywhere",
    },
    {
      name: "Copy Team Code",
      icon: "📋",
      action: async () => {
        await navigator.clipboard.writeText(team.code);
        toast.success("Team code copied! Share just the code.");
      },
      description: `Code: ${team.code}`,
    },
    {
      name: "Share on WhatsApp",
      icon: "💬",
      action: () => {
        const message = `Join my team "${team.name}" for ${contest.title}! Use this link: ${inviteLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
      },
      description: "Share via WhatsApp",
    },
    {
      name: "Share via Email",
      icon: "📧",
      action: () => {
        const subject = `Join my team for ${contest.title}`;
        const body = `Hello!\n\nJoin my team "${team.name}" for the coding contest "${contest.title}".\n\nUse this link: ${inviteLink}\n\nOr enter team code: ${team.code}\n\nSee you there!`;
        window.open(
          `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        );
      },
      description: "Share via email",
    },
  ];

  const handleCopyAndClose = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-purple-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Invite Teammates
                </h3>
                <p className="text-sm text-gray-600">
                  Share your team with others
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
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
          </div>

          {/* Team Info */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200 shadow-sm">
            <p className="font-semibold text-gray-900 text-sm">
              Team: <span className="text-purple-600">{team.name}</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Contest: {contest.title}
            </p>
          </div>
        </div>

        {/* Share Options - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {shareMethods.map((method, index) => (
              <button
                key={index}
                onClick={method.action}
                className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {method.icon}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-purple-700">
                    {method.name}
                  </p>
                  <p className="text-sm text-gray-600 group-hover:text-gray-700">
                    {method.description}
                  </p>
                </div>
                <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            ))}
          </div>

          {/* Quick Info Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-900 text-sm mb-2">
              💡 Quick Tips
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Share the link for one-click joining</li>
              <li>• Share the code if they're already on the site</li>
              <li>• Team members will auto-join when they click your link</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 font-semibold rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition-colors shadow-sm"
            >
              Close
            </button>
            <button
              onClick={handleCopyAndClose}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105 shadow-md"
            >
              Copy Link & Close
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            You can invite more teammates later from the lobby
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContestLobby;
