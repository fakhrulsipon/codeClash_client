import { useEffect, useState } from "react";
import useAxiosPublic from "../../hook/useAxiosPublic";

interface LeaderboardItem {
  _id: string;
  userEmail: string;
  userName: string;
  totalPoints: number;
  totalSolved: number;
  totalFailures: number;
  avatarUrl?: string;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axiosPublic = useAxiosPublic();

  const fetchLeaderboard = async () => {
    try {
      setError(null);
      const res = await axiosPublic.get("/api/users/leaderboard/top");
      
      if (res.data.success && res.data.leaderboard) {
        setLeaderboard(res.data.leaderboard);
      } else {
        setError("Failed to fetch leaderboard data");
      }
    } catch (err) {
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // প্রতি 30 সেকেন্ডে fetch
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center p-8 bg-red-500/20 border border-red-500/30 rounded-2xl max-w-md">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 px-4 py-2 rounded-xl hover:bg-cyan-500/30 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
          🏆 Leaderboard
        </h1>
        <p className="text-gray-400">Top performers based on problem-solving skills and points earned</p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full">
          <thead className="bg-slate-700/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Rank</th>
              <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">User</th>
              <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Points</th>
              <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Solved</th>
              <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Failed</th>
              <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Success Rate</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((user, index) => (
                <tr 
                  key={user._id || user.userEmail} 
                  className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        index === 0 
                          ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white" 
                          : index === 1
                          ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"
                          : index === 2
                          ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white"
                          : "bg-slate-700 text-gray-300"
                      }`}>
                        {index + 1}
                      </span>
                      {index < 3 && (
                        <span className="text-lg">
                          {index === 0 ? "👑" : index === 1 ? "🥈" : "🥉"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.userName}
                          className="w-10 h-10 rounded-full border-2 border-cyan-500/50"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-cyan-400/50">
                          {user.userName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div>
                        <div className="text-white font-semibold">
                          {user.userName || "Unknown User"}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {user.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-cyan-400 font-bold text-lg">
                      {user.totalPoints || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-400 font-semibold">
                      {user.totalSolved || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-red-400 font-semibold">
                      {user.totalFailures || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${
                              (user.totalSolved || 0) + (user.totalFailures || 0) > 0
                                ? Math.round(
                                    ((user.totalSolved || 0) / 
                                      ((user.totalSolved || 0) + (user.totalFailures || 0))) * 100
                                  )
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-gray-300 text-sm font-medium w-12">
                        {((user.totalSolved || 0) + (user.totalFailures || 0)) > 0
                          ? Math.round(
                              ((user.totalSolved || 0) / 
                                ((user.totalSolved || 0) + (user.totalFailures || 0))) * 100
                            )
                          : 0}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-4xl">🏆</div>
                    <p className="text-lg">No leaderboard data available</p>
                    <p className="text-sm">Start solving problems to appear on the leaderboard!</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Refresh Info */}
      <div className="text-center mt-6">
        <p className="text-gray-500 text-sm">
          Leaderboard updates every 30 seconds
        </p>
      </div>
    </div>
  );
}