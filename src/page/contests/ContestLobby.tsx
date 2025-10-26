import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hook/useAxiosSecure";

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
  const teamCodeFromUrl = searchParams.get("teamCode");
  const { user } = useContext(AuthContext)!;
  const axiosSecure = useAxiosSecure();

  const [contest, setContest] = useState<Contest | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamNotFound, setTeamNotFound] = useState(false);

  // Fetch contest info
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const { data } = await axiosSecure.get(`/api/contests/${contestId}`);
        setContest(data);
      } catch (error) {
        console.error("Error fetching contest:", error);
        toast.error("Failed to load contest");
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
  }, [axiosSecure, contestId]);

  // Fetch team info
  useEffect(() => {
    if (contest?.type === "team" && user?.uid) {
      const fetchTeam = async () => {
        try {
          setTeamLoading(true);
          setTeamNotFound(false);

          let url;
          if (teamCodeFromUrl) {
            url = `/api/teams/code/${teamCodeFromUrl}`;
          } else {
            url = `/api/teams/user/${user.uid}?contestId=${contestId}`;
          }

          const { data } = await axiosSecure.get(url);
          setTeam(data);

          if (data.status === "started") {
            toast.success("Contest started! Redirecting...");
            navigate(`/contests/${contestId}/workspace`);
          }
        } catch (error: any) {
          if (error.response?.status === 404) {
            setTeamNotFound(true);
          } else {
            console.error("Error fetching team:", error);
            toast.error("Failed to load team information");
          }
        } finally {
          setTeamLoading(false);
        }
      };

      fetchTeam();
      const interval = setInterval(fetchTeam, 2000);
      return () => clearInterval(interval);
    }
  }, [contest, contestId, user, navigate, teamCodeFromUrl, axiosSecure]);

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

      const { data } = await axiosSecure.patch(`/teams/${team.code}/ready`, {
        userId: user.uid,
        ready: !member.ready,
      });
      setTeam(data);
      toast.success(!member.ready ? "You are ready!" : "You are not ready");
    } catch (error: any) {
      console.error("Error updating ready status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update ready status"
      );
    }
  };

  const handleStartContest = async () => {
    if (!team || !user?.uid) return;

    try {
      const { data } = await axiosSecure.patch(`/teams/${team.code}/start`, {
        userId: user.uid,
      });
      setTeam(data.team);
      toast.success("Contest started! Redirecting...");
      setTimeout(() => navigate(`/contests/${contestId}/workspace`), 1000);
    } catch (error: any) {
      console.error("Error starting contest:", error);
      toast.error(error.response?.data?.message || "Failed to start contest");
    }
  };

  const handleCopyTeamCode = () => {
    if (team?.code) {
      navigator.clipboard.writeText(team.code);
      toast.success("Team code copied to clipboard!");
    }
  };

  // ENHANCED LEADER DETECTION - PRIORITIZE ROLE AND CREATEDBY
  const currentUserMember = team?.members?.find((m) => m.userId === user?.uid);
  const isLeader =
    currentUserMember?.role === "leader" || team?.createdBy === user?.uid;
  const allReady = team?.members?.every((m) => m.ready) ?? false;

  // Debug info
  useEffect(() => {
    if (team && user?.uid) {
      console.log("🔍 Enhanced Leader Detection Debug:", {
        currentUserId: user.uid,
        teamCreatedBy: team.createdBy,
        currentUserRole: currentUserMember?.role,
        isLeaderByCreatedBy: team.createdBy === user.uid,
        isLeaderByRole: currentUserMember?.role === "leader",
        finalIsLeader: isLeader,
        allMembers: team.members,
      });
    }
  }, [team, user, currentUserMember, isLeader]);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {contest.title}
          </h1>
          <div className="flex justify-center items-center gap-4 text-lg text-gray-600 dark:text-gray-300">
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full shadow-sm">
              {contest.type === "individual"
                ? "Individual Contest"
                : "Team Contest"}
            </span>
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full shadow-sm">
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
                {isLeader && team && (
                  <div className="flex flex-col items-center gap-3">
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
                    <div className="bg-yellow-400/30 text-yellow-100 px-4 py-2 rounded-lg">
                      👑 You are the Team Leader
                    </div>
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

                  {/* Debug Info - Remove in production */}
                  {team && user?.uid && (
                    <div className="mb-4 p-3 bg-black/20 rounded-lg text-xs">
                      <p>
                        <strong>Debug:</strong> Your ID: {user.uid} | Team
                        Created By: {team.createdBy} | Your Role:{" "}
                        {currentUserMember?.role} | You are{" "}
                        {isLeader ? "LEADER 🎯" : "MEMBER"}
                      </p>
                    </div>
                  )}

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
              ) : teamNotFound ? (
                <div className="text-center bg-white/20 rounded-2xl p-8">
                  <p className="text-xl mb-4">You haven't joined a team yet!</p>
                  <button
                    onClick={() => navigate(`/contests/${contestId}`)}
                    className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:scale-105 transition-transform"
                  >
                    Join a Team
                  </button>
                </div>
              ) : (
                <div className="text-center bg-white/20 rounded-2xl p-8">
                  <LoadingSpinner />
                  <p className="mt-2">Loading team information...</p>
                </div>
              )}

              {/* Action Buttons */}
              {team && (
                <div className="flex flex-col items-center gap-4">
                  {!isLeader && currentUserMember && (
                    <button
                      onClick={handleReadyToggle}
                      className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
                        currentUserMember.ready
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      } hover:scale-105 shadow-lg`}
                    >
                      {currentUserMember.ready
                        ? "Mark as Not Ready"
                        : "I'm Ready!"}
                    </button>
                  )}

                  {isLeader && (
                    <div className="flex flex-col items-center gap-3">
                      <button
                        onClick={handleStartContest}
                        disabled={!allReady}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
                          allReady
                            ? "bg-green-500 hover:bg-green-600 text-white hover:scale-105 shadow-lg"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`}
                      >
                        {allReady
                          ? "🎯 Start Contest Now!"
                          : "Waiting for members to be ready..."}
                      </button>
                      {!allReady && team.members && (
                        <p className="text-sm opacity-80">
                          {team.members.filter((m) => m.ready).length} of{" "}
                          {team.members.length} members ready
                        </p>
                      )}
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
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Problems Preview ({contest.problems.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contest.problems.slice(0, 4).map((problem, index) => (
                <div
                  key={problem._id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Problem {index + 1}: {problem.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {problem.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        problem.difficulty === "Easy"
                          ? "bg-green-100 text-green-800"
                          : problem.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {problem.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestLobby;
