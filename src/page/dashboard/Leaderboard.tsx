import { useEffect, useState } from "react";
import useAxiosPublic from "../../hook/useAxiosPublic";

interface LeaderboardItem {
  _id: string;
  userEmail: string;
  userName: string;
  totalPoints: number;
  totalSolved: number;
  totalFailures: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  const fetchLeaderboard = async () => {
    try {
      const res = await axiosPublic.get("/api/users/leaderboard");
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard);
      } else {
        console.error("Failed to fetch leaderboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000); // প্রতি 10 সেকেন্ডে fetch
    return () => clearInterval(interval); // Cleanup
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>

      <table className="w-full bg-white border rounded-lg shadow-sm overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-gray-600">Rank</th>
            <th className="px-6 py-3 text-left text-gray-600">Name</th>
            <th className="px-6 py-3 text-left text-gray-600">Email</th>
            <th className="px-6 py-3 text-left text-gray-600">Points</th>
            <th className="px-6 py-3 text-left text-gray-600">Solved</th>
            <th className="px-6 py-3 text-left text-gray-600">Failures</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr
              key={user._id}
              className={`border-b hover:bg-gray-50 ${
                index === 0 ? "bg-yellow-50 font-semibold" : ""
              }`}
            >
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3">{user.userName}</td>
              <td className="px-6 py-3">{user.userEmail}</td>
              <td className="px-6 py-3">{user.totalPoints}</td>
              <td className="px-6 py-3">{user.totalSolved}</td>
              <td className="px-6 py-3">{user.totalFailures}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
