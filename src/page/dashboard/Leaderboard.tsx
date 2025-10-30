import { useEffect, useState } from "react";
import useAxiosPublic from "../../hook/useAxiosPublic";

interface LeaderboardItem {
  _id: string;
  userEmail: string;
  userName: string;
  totalPoints: number;
  totalSolved: number;
  totalFailures: number;
  userImage?: string;
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
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  // Function to handle image loading errors
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    // Show fallback
    const fallback = target.nextSibling as HTMLElement;
    if (fallback) {
      fallback.style.display = "flex";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="animate-pulse">
              <div className="h-12 bg-purple-800 rounded-lg w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-700 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-4 md:p-6 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-700 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-slate-700 rounded w-24 md:w-32 mb-2"></div>
                      <div className="h-3 bg-slate-700 rounded w-20 md:w-24"></div>
                    </div>
                  </div>
                  <div className="flex gap-4 md:gap-6">
                    <div className="text-center">
                      <div className="h-6 bg-slate-700 rounded w-12 md:w-16 mb-1"></div>
                      <div className="h-3 bg-slate-700 rounded w-8 md:w-12"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-6 bg-slate-700 rounded w-12 md:w-16 mb-1"></div>
                      <div className="h-3 bg-slate-700 rounded w-8 md:w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-8">
        <div className="text-center p-6 md:p-8 bg-red-500/10 backdrop-blur-lg border border-red-500/30 rounded-2xl max-w-md mx-4">
          <div className="text-4xl md:text-6xl mb-4">😞</div>
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            🏆 CodeClash Leaderboard
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Top performers based on problem-solving skills and points earned
          </p>
        </div>

        {/* Desktop Table (hidden on mobile) */}
        <div className="hidden lg:block bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">
                  User
                </th>
                <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">
                  Points
                </th>
                <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">
                  Solved
                </th>
                <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">
                  Failed
                </th>
                <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">
                  Success Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length > 0 ? (
                leaderboard.map((user, index) => {
                  const successRate =
                    user.totalSolved + user.totalFailures > 0
                      ? Math.round(
                          (user.totalSolved /
                            (user.totalSolved + user.totalFailures)) *
                            100
                        )
                      : 0;

                  return (
                    <tr
                      key={user._id || user.userEmail}
                      className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                              index === 0
                                ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-500/25"
                                : index === 1
                                  ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 shadow-lg shadow-gray-400/25"
                                  : index === 2
                                    ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg shadow-amber-600/25"
                                    : "bg-slate-700 text-gray-300 shadow-lg shadow-purple-500/10"
                            }`}
                          >
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
                          <div className="relative">
                            {user.userImage ? (
                              <>
                                <img
                                  src={user.userImage}
                                  alt={user.userName}
                                  className="w-10 h-10 rounded-full border-2 border-cyan-500/50 object-cover"
                                  onError={handleImageError}
                                />
                                <div
                                  className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-cyan-400/50 absolute top-0 left-0 hidden"
                                  id={`fallback-${user._id}`}
                                >
                                  {user.userName?.charAt(0)?.toUpperCase() ||
                                    "U"}
                                </div>
                              </>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-cyan-400/50">
                                {user.userName?.charAt(0)?.toUpperCase() || "U"}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-white font-semibold truncate max-w-[200px]">
                              {user.userName || "Unknown User"}
                            </div>
                            <div className="text-gray-400 text-sm truncate max-w-[200px]">
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
                          <div className="flex-1 bg-slate-700 rounded-full h-2 min-w-[80px]">
                            <div
                              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000 shadow-lg shadow-green-500/25"
                              style={{
                                width: `${successRate}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-gray-300 text-sm font-medium w-8 text-right">
                            {successRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-4xl">🏆</div>
                      <p className="text-lg">No leaderboard data available</p>
                      <p className="text-sm">
                        Start solving problems to appear on the leaderboard!
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (shown on mobile) */}
        <div className="lg:hidden grid gap-4 md:gap-6">
          {leaderboard.length > 0 ? (
            leaderboard.map((user, index) => {
              const successRate =
                user.totalSolved + user.totalFailures > 0
                  ? Math.round(
                      (user.totalSolved /
                        (user.totalSolved + user.totalFailures)) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={user._id || user.userEmail}
                  className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-4 md:p-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
                >
                  {/* Rank and User Info Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-500/25"
                            : index === 1
                              ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 shadow-lg shadow-gray-400/25"
                              : index === 2
                                ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg shadow-amber-600/25"
                                : "bg-slate-700 text-gray-300 shadow-lg shadow-purple-500/10"
                        }`}
                      >
                        {index + 1}
                      </span>
                      {index < 3 && (
                        <span className="text-lg">
                          {index === 0 ? "👑" : index === 1 ? "🥈" : "🥉"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {user.userImage ? (
                        <>
                          <img
                            src={user.userImage}
                            alt={user.userName}
                            className="w-10 h-10 rounded-full border-2 border-cyan-500/50 object-cover"
                            onError={handleImageError}
                          />
                          <div
                            className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-cyan-400/50 absolute hidden"
                            id={`fallback-mobile-${user._id}`}
                          >
                            {user.userName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        </>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-cyan-400/50">
                          {user.userName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Name and Email */}
                  <div className="mb-4">
                    <div className="text-white font-semibold text-lg truncate">
                      {user.userName || "Unknown User"}
                    </div>
                    <div className="text-gray-400 text-sm truncate">
                      {user.userEmail}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-cyan-500/10">
                      <div className="text-xl font-bold text-cyan-400 mb-1">
                        {user.totalPoints || 0}
                      </div>
                      <div className="text-xs text-cyan-300 font-semibold">
                        Points
                      </div>
                    </div>

                    <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-green-500/10">
                      <div className="text-xl font-bold text-green-400 mb-1">
                        {user.totalSolved || 0}
                      </div>
                      <div className="text-xs text-green-300 font-semibold">
                        Solved
                      </div>
                    </div>

                    <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-red-500/10">
                      <div className="text-xl font-bold text-red-400 mb-1">
                        {user.totalFailures || 0}
                      </div>
                      <div className="text-xs text-red-300 font-semibold">
                        Failed
                      </div>
                    </div>
                  </div>

                  {/* Success Rate */}
                  <div>
                    <div className="flex justify-between text-sm text-purple-200 mb-2">
                      <span>Success Rate</span>
                      <span className="font-semibold">{successRate}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000 shadow-lg shadow-green-500/25"
                        style={{
                          width: `${successRate}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-purple-500/20">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Champions Yet
              </h3>
              <p className="text-purple-200 mb-4">
                Be the first to solve problems and claim your spot!
              </p>
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300">
                Start Coding
              </button>
            </div>
          )}
        </div>

        {/* Refresh Info */}
        <div className="text-center mt-6 md:mt-8">
          <div className="inline-flex items-center gap-2 bg-slate-800/60 backdrop-blur-lg border border-cyan-500/20 rounded-2xl px-4 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-cyan-300 text-xs md:text-sm">
              Live updates every 30 seconds • {leaderboard.length} coders
              competing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
