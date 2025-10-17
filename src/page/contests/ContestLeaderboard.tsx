import { useQuery } from "@tanstack/react-query";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../provider/AuthProvider";

interface Submission {
  problemId: string;
  status: string;
  point: number;
  submittedAt: string;
}

interface LeaderboardUser {
  _id: string; // userEmail
  userName: string;
  totalPoints: number;
  submissions: Submission[];
}

interface Props {
  contestId: string;
}

export default function ContestLeaderboard({ contestId }: Props) {
  const { user } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { data: leaderboard = [], isLoading } = useQuery<LeaderboardUser[]>({
    queryKey: ["contestLeaderboard", contestId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3000/api/contestSubmissions/leaderboard/${contestId}`
      );
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center text-black">Loading leaderboard...</p>;

  return (
    <div className="mt-8 p-6 rounded-3xl shadow-2xl bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-400 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-black">
        Contest Leaderboard
      </h2>

      {leaderboard.length === 0 ? (
        <p className="text-center text-black">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white/20 rounded-lg">
            <thead>
              <tr className="bg-white/30">
                <th className="py-2 px-3 border text-black">Rank</th>
                <th className="py-2 px-3 border text-black">User</th>
                <th className="py-2 px-3 border text-black">Total Points</th>
                <th className="py-2 px-3 border text-black">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((u, index) => (
                <tr
                  key={u._id}
                  className={`border-b border-white/30 hover:bg-white/10 transition ${
                    selectedUser === u._id ? "bg-white/10" : ""
                  }`}
                >
                  <td className="py-2 px-3 font-semibold text-black">#{index + 1}</td>
                  <td className="py-2 px-3 text-black">{u.userName}</td>
                  <td className="py-2 px-3 font-medium text-black">{u.totalPoints}</td>
                  <td className="py-2 px-3">
                    {user?.email === u._id && (
                      <button
                        onClick={() =>
                          setSelectedUser(selectedUser === u._id ? null : u._id)
                        }
                        className="text-sm bg-white/30 text-black px-3 py-1 rounded-md hover:bg-white/50 transition"
                      >
                        {selectedUser === u._id ? "Hide Details" : "View Details"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <div className="mt-6 border-t border-white/40 pt-4">
          <h3 className="text-lg font-semibold mb-3 text-black">
            {leaderboard.find((u) => u._id === selectedUser)?.userName}'s Submissions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white/20 rounded-lg">
              <thead>
                <tr className="bg-white/30">
                  <th className="py-2 px-3 border text-black">Problem ID</th>
                  <th className="py-2 px-3 border text-black">Status</th>
                  <th className="py-2 px-3 border text-black">Points</th>
                  <th className="py-2 px-3 border text-black">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard
                  .find((u) => u._id === selectedUser)
                  ?.submissions.map((sub, idx) => (
                    <tr key={idx} className="border-b border-white/30 hover:bg-white/10">
                      <td className="py-2 px-3 text-black">{sub.problemId}</td>
                      <td
                        className={`py-2 px-3 font-semibold ${
                          sub.status === "Success" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {sub.status}
                      </td>
                      <td className="py-2 px-3 text-black">{sub.point}</td>
                      <td className="py-2 px-3 text-black">
                        {new Date(sub.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
