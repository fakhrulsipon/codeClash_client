import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Link } from "react-router";

// 🧩 User type definition
interface TopUser {
  userEmail: string;
  userName: string;
  totalPoints: number;
  totalSolved: number;
  totalFailures: number;
  avatarUrl?: string;
}

// 🧠 API response type
interface LeaderboardResponse {
  success: boolean;
  leaderboard: TopUser[];
}

// 📡 Fetch function with Axios + proper typing
const fetchTopUsers = async (): Promise<TopUser[]> => {
  const res = await axios.get<LeaderboardResponse>(
    "http://localhost:3000/api/users/leaderboard/top"
  );
  return res.data.leaderboard;
};

// 🎨 Function to generate gradient based on rank
const getRankGradient = (index: number) => {
  switch (index) {
    case 0:
      return "from-yellow-400 to-amber-500 shadow-yellow-500/30";
    case 1:
      return "from-gray-300 to-gray-400 shadow-gray-400/30";
    case 2:
      return "from-amber-600 to-orange-500 shadow-amber-600/30";
    default:
      return "from-purple-500 to-indigo-600 shadow-purple-500/20";
  }
};

// 🏆 Rank badges with emojis
const getRankBadge = (index: number) => {
  switch (index) {
    case 0:
      return "👑";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    default:
      return `#${index + 1}`;
  }
};

// 🎭 Fallback avatar component
const UserAvatar: React.FC<{ user: TopUser; index: number }> = ({
  user,
  index,
}) => {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.userName}
        className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
      />
    );
  }

  // Generate avatar with initials and gradient
  const initials = user.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const gradientClass =
    index === 0
      ? "from-yellow-400 to-amber-500"
      : index === 1
        ? "from-gray-300 to-gray-400"
        : index === 2
          ? "from-amber-600 to-orange-500"
          : "from-purple-400 to-indigo-500";

  return (
    <div
      className={`w-16 h-16 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-lg`}
    >
      {initials}
    </div>
  );
};

const TopUsersSection: React.FC = () => {
  const {
    data: topUsers = [],
    isLoading,
    isError,
  } = useQuery<TopUser[]>({
    queryKey: ["topUsers"],
    queryFn: fetchTopUsers,
  });

  if (isLoading)
    return (
      <div className="py-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-purple-800 rounded w-48 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 rounded-2xl p-6 h-48"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="py-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-400 text-lg">🚨 Failed to load leaderboard</p>
          <p className="text-purple-300 mt-2">Please try again later</p>
        </div>
      </div>
    );

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🌟 Top Performers
          </h2>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Celebrating our brightest stars who are leading the way with
            exceptional problem-solving skills
          </p>
        </div>

        {/* Leaderboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {topUsers.map((user, index) => (
            <div
              key={user.userEmail}
              className={`relative group transform transition-all duration-500 hover:scale-105 hover:rotate-1`}
            >
              {/* Rank Badge */}
              <div
                className={`absolute -top-3 -left-3 z-20 w-12 h-12 rounded-full bg-gradient-to-r ${getRankGradient(index)} flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white`}
              >
                {getRankBadge(index)}
              </div>

              {/* Main Card */}
              <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 h-full">
                {/* User Avatar & Basic Info */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4 relative">
                    <UserAvatar user={user} index={index} />
                    {/* Animated ring for top 3 */}
                    {index < 3 && (
                      <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-ping opacity-60"></div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                    {user.userName}
                  </h3>
                  <p className="text-purple-300 text-sm line-clamp-1">
                    {user.userEmail}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-purple-500/10">
                    <div className="text-2xl font-bold text-white mb-1">
                      {user.totalPoints}
                    </div>
                    <div className="text-xs text-purple-300 font-semibold">
                      Points
                    </div>
                  </div>

                  <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-green-500/10">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {user.totalSolved}
                    </div>
                    <div className="text-xs text-green-300 font-semibold">
                      Solved
                    </div>
                  </div>

                  <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-red-500/10">
                    <div className="text-2xl font-bold text-red-400 mb-1">
                      {user.totalFailures}
                    </div>
                    <div className="text-xs text-red-300 font-semibold">
                      Failed
                    </div>
                  </div>
                </div>

                {/* Success Rate */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-purple-200 mb-1">
                    <span>Success Rate</span>
                    <span>
                      {user.totalSolved + user.totalFailures > 0
                        ? Math.round(
                            (user.totalSolved /
                              (user.totalSolved + user.totalFailures)) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${
                          user.totalSolved + user.totalFailures > 0
                            ? (user.totalSolved /
                                (user.totalSolved + user.totalFailures)) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-12">
          <Link to="/dashboard/leaderboard">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
            View Full Leaderboard 🚀
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopUsersSection;
