import React, { useEffect, useState } from "react";
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
  problems: Problem[];
  createdAt: string;
  type: "individual" | "team";
};

const AllContests: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<
    "status" | "difficulty" | "none"
  >("none");

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await axios.get<Contest[]>(
          "http://localhost:3000/api/contests"
        );
        setContests(res.data);
      } catch (err) {
        console.error("Failed to fetch contests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  if (loading) return <LoadingSpinner />;

  // ---------- Utility functions ----------
  const getStatus = (start: string, end: string) => {
    const now = new Date().getTime();
    if (now < new Date(start).getTime()) return "Upcoming";
    if (now > new Date(end).getTime()) return "Finished";
    return "Running";
  };

  const getUniqueDifficulties = (problems: Problem[]) => {
    const unique = Array.from(
      new Set(problems.map((p) => p.difficulty.toLowerCase()))
    );
    return unique.join(", ");
  };

  const statusColors: Record<string, string> = {
    Upcoming: "bg-yellow-200 text-yellow-800",
    Running: "bg-green-200 text-green-800",
    Finished: "bg-gray-200 text-gray-700",
  };

  // ---------- Filtered + Sorted Contests ----------
  const filtered = contests.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedContests = [...filtered].sort((a, b) => {
    if (sortOption === "status") {
      const statusOrder: Record<string, number> = {
        Running: 0,
        Upcoming: 1,
        Finished: 2,
      };
      const statusA = getStatus(a.startTime, a.endTime);
      const statusB = getStatus(b.startTime, b.endTime);
      return statusOrder[statusA] - statusOrder[statusB];
    } else if (sortOption === "difficulty") {
      const difficultyRank: Record<string, number> = {
        easy: 1,
        medium: 2,
        hard: 3,
      };
      const maxDifficultyA = Math.max(
        ...a.problems.map(
          (p) => difficultyRank[p.difficulty.toLowerCase()] || 0
        )
      );
      const maxDifficultyB = Math.max(
        ...b.problems.map(
          (p) => difficultyRank[p.difficulty.toLowerCase()] || 0
        )
      );
      return maxDifficultyB - maxDifficultyA; // Hardest first
    }
    return 0;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-blue-800">
        All Contests
      </h1>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
        <input
          type="text"
          placeholder="Search contests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 md:w-1/3 border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <div className="flex items-center gap-2">
          <label className="font-semibold">Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="border rounded-md px-3 py-2 focus:outline-none"
          >
            <option value="none">None</option>
            <option value="status">Status</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>
      </div>

      {/* Contest grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {sortedContests.map((contest) => {
          const status = getStatus(contest.startTime, contest.endTime);
          return (
            <div
              key={contest._id}
              className="w-full max-w-sm relative rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-white/80 via-blue-50/80 to-cyan-50/80
             backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105 flex flex-col justify-between"
            >
              {/* Status badge */}
              <span
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm mt-12 font-semibold ${statusColors[status]}`}
              >
                {status}
              </span>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-blue-700 truncate">
                  {contest.title}
                </h2>

                <p className="text-sm text-gray-700 mb-1 truncate">
                  <strong>Start:</strong>{" "}
                  {new Date(contest.startTime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700 mb-1 truncate">
                  <strong>End:</strong>{" "}
                  {new Date(contest.endTime).toLocaleString()}
                </p>

                {/* Chips */}
                <div className="flex flex-wrap gap-2 my-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    Problems: {contest.problems.length}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    Type: {contest.type || "individual"}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Difficulty: {getUniqueDifficulties(contest.problems)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <a
                  href={`/contests/${contest._id}`}
                  className="inline-block px-5 py-2 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 transition duration-200 text-center"
                >
                  View Contest
                </a>

                <p className="text-xs text-gray-500 mt-2 sm:mt-0">
                  Created: {new Date(contest.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {sortedContests.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No contests found.</p>
      )}
    </div>
  );
};

export default AllContests;
