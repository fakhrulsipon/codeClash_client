import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";

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
};

const JoinContest: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);

  // Team inputs
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");

  useEffect(() => {
    if (!contestId) return;

    const fetchContest = async () => {
      try {
        const res = await axios.get<Contest>(
          `http://localhost:3000/api/contests/${contestId}`
        );
        setContest(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId]);

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

  // Individual contest join
  const handleJoinIndividual = () => {
    // Optionally call backend to mark as joined
    navigate(`/contests/${contest._id}/lobby`);
  };

  // Team create/join
  const handleCreateTeam = () => {
    if (!teamName.trim()) return alert("Enter a team name");
    console.log("Creating team:", teamName);
    setJoined(true);
  };

  const handleJoinTeam = () => {
    if (!teamCode.trim()) return alert("Enter a team code");
    console.log("Joining team with code:", teamCode);
    setJoined(true);
  };

  const handleConfirmJoin = () => {
    navigate(`/contests/${contest._id}/lobby`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-4">{contest.title}</h1>
        <p className="text-lg font-medium mb-6">
          Contest Type:{" "}
          <span className="font-semibold">{contest.type}</span>
        </p>
        {contest.description && (
          <p className="mb-6 bg-white/20 text-gray-900 p-4 rounded-xl shadow-inner">
            {contest.description}
          </p>
        )}

        {status === "Finished" ? (
          <p className="text-red-500 font-semibold">
            This contest has already ended.
          </p>
        ) : contest.type.toLowerCase() === "individual" ? (
          <button
            onClick={handleJoinIndividual}
            className="px-6 py-3 bg-white text-purple-700 font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Join Contest
          </button>
        ) : (
          <>
            {!joined ? (
              <div className="space-y-6">
                {/* Create Team */}
                <div className="bg-white/50 p-4 rounded-xl shadow">
                  <h3 className="font-bold mb-2">Create a Team</h3>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                  />
                  <button
                    onClick={handleCreateTeam}
                    className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Create Team
                  </button>
                </div>

                {/* Join Team */}
                <div className="bg-white/50 p-4 rounded-xl shadow">
                  <h3 className="font-bold mb-2">Join an Existing Team</h3>
                  <input
                    type="text"
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value)}
                    placeholder="Enter team code"
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                  />
                  <button
                    onClick={handleJoinTeam}
                    className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Join Team
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-green-700 font-semibold mb-4">
                  Team joined successfully! ✅
                </p>
                <button
                  onClick={handleConfirmJoin}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
                >
                  Confirm Join
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JoinContest;
