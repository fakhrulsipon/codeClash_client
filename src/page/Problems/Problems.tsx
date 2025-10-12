import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hook/useAxiosSecure";

interface StarterCode {
  javascript: string;
  python: string;
  java: string;
  c: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  languages: string[];
  starterCode: StarterCode;
  testCases: TestCase[];
  createdAt: string;
}

const Problems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (search) params.append("title", search);
        if (difficulty) params.append("difficulty", difficulty);

        const res = await axiosSecure(`/api/problems?${params.toString()}`);
        setProblems(res.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [axiosSecure, search, difficulty]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Confirm solve function
  const handleConfirm = () => {
    if (selectedProblem) {
      navigate(`/problems/${selectedProblem._id}`);
    }
    setSelectedProblem(null);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-5xl mx-auto px-4">
        {/* 💎 Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-3">
            🚀 Explore Coding Challenges
          </h1>
          <p className="text-gray-600 text-lg">
            Sharpen your problem-solving skills with exciting coding problems!
          </p>
          <div className="mt-3 w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* 🔍 Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="🔎 Search by problem title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          >
            <option value="">Sort by difficulty</option>
            <option value="easy">🟢 Easy</option>
            <option value="medium">🟡 Medium</option>
            <option value="hard">🔴 Hard</option>
          </select>
        </div>

        {/* 📋 Problem List */}
        <ul className="space-y-6">
          {problems.map((problem) => (
            <li
              key={problem._id}
              className="sm:p-6 p-4 border border-blue-100 rounded-2xl bg-white shadow hover:shadow-lg transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {problem.title}
              </h2>

              <p className="text-gray-600 text-sm sm:text-base">
                {problem.description.length > 150
                  ? problem.description.slice(0, 150) + "..."
                  : problem.description}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    problem.difficulty.trim().toLowerCase() === "easy"
                      ? "bg-green-100 text-green-700"
                      : problem.difficulty.trim().toLowerCase() === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {problem.difficulty}
                </span>

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                  {problem.category}
                </span>
              </div>

              {/* Solve Problem Button */}
              <button
                onClick={() => setSelectedProblem(problem)}
                className="bg-emerald-500 px-6 py-2 mt-6 text-white hover:bg-emerald-600 transition rounded-xl shadow-md"
              >
                Solve Problem
              </button>
            </li>
          ))}
        </ul>

        {/* 🧩 Confirmation Modal */}
        {selectedProblem && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-[90%] max-w-md text-center transform transition-all scale-105 animate-in fade-in-0 zoom-in-95">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  🚀 Ready to Solve?
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  You’re about to dive into{" "}
                  <span className="font-semibold text-blue-600">
                    {selectedProblem.title}
                  </span>
                  . Are you sure you want to start solving this challenge?
                </p>
              </div>

              <div className="flex justify-center gap-5 mt-8">
                <button
                  onClick={handleConfirm}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:from-emerald-600 hover:to-emerald-700 transition-transform transform hover:scale-105"
                >
                  ✅ Yes, Let’s Solve
                </button>
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl text-lg font-medium shadow-sm hover:bg-gray-300 transition-transform transform hover:scale-105"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
