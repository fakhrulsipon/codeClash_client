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

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await axios.get<Contest[]>(
          "https://code-clash-server-rust.vercel.app/api/contests"
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

  const filtered = contests.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (start: string, end: string) => {
    const now = new Date().getTime();
    if (now < new Date(start).getTime()) return "Upcoming";
    if (now > new Date(end).getTime()) return "Finished";
    return "Running";
  };

  const statusColors: Record<string, string> = {
    Upcoming: "bg-yellow-200 text-yellow-800",
    Running: "bg-green-200 text-green-800",
    Finished: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-blue-800">
        All Contests
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search contests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-3/4 md:w-1/2 mx-auto block border rounded-md p-3 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      {/* Contest grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {filtered.map((contest) => {
          const status = getStatus(contest.startTime, contest.endTime);
          return (
            <div
              key={contest._id}
              className="w-full max-w-sm relative rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-white/80 via-blue-50/80 to-cyan-50/80
             backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105 flex flex-col justify-between"
            >
              {/* Status badge */}
              <span
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm mt-0 md:mt-16 font-semibold ${statusColors[status]}`}
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
                    Type: {contest.type}
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

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No contests found.</p>
      )}
    </div>
  );
};

export default AllContests;
