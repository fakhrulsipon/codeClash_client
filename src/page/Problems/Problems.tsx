import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Link } from "react-router";

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

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch("http://code-clash-server-7f46.vercel.app/api/problems");
        const data = await res.json();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen py-10">
      <div className="sm:max-w-5xl mx-auto sm:p-6 p-3">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          Problems Set
        </h1>
        <h3 className="font-medium text-gray-700 text-center mt-3 mb-8">
          Kickstart Your Solution with These Code Templates
        </h3>

        <ul className="space-y-6">
          {problems.map((problem) => (
            <li
              key={problem._id}
              className="sm:p-6 p-3 border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {problem.title}
              </h2>

              <p className="text-gray-600 mt-2">{problem.description}</p>

              <div className="flex flex-wrap gap-3 mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    problem.difficulty.trim().toLowerCase() === "easy"
                      ? "bg-green-100 text-green-600"
                      : problem.difficulty.trim().toLowerCase() === "medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                  }`}
                >
                  {problem.difficulty}
                </span>

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                  {problem.category}
                </span>
                
              </div>
              <Link to={`/problems/${problem._id}`}><button className="bg-emerald-500 px-5 py-3 mt-6 text-white hover:bg-emerald-700 cursor-pointer rounded-2xl">Solve Problem</button></Link>
            </li>
          ))}
        </ul>
        
      </div>
    </div>
  );
};

export default Problems;
