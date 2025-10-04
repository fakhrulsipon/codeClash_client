import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  category: string;
  createdAt: string;
}

const ProblemsSection: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We use an async function inside useEffect for cleaner async/await syntax.
    const fetchProblems = async () => {
      try {
        const res = await axios.get<Problem[]>(
          "https://code-clash-server-eight.vercel.app/api/problems"
        );
        setProblems(res.data);
      } catch (err) {
        console.error("Failed to fetch problems:", err);
        // You could also set an error state here to show a user-friendly message
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="relative py-16 px-6 overflow-hidden">
      {/* Blurred background circles */}
      <div className="absolute top-0 left-1/2 w-[500px] h-[500px] rounded-full filter blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full filter blur-3xl opacity-30"></div>

      <h2 className="relative text-4xl font-extrabold text-center mb-4 text-white drop-shadow-lg">
        Sharpen Your Skills with Live Coding Challenges
      </h2>
      <p className="text-center text-lg md:text-xl text-white/90 mb-7 max-w-2xl mx-auto">
        Solve real coding problems, test your logic, and level up your
        programming skills. Each challenge is designed to push your limits and
        prepare you for competitive coding.
      </p>

      <div className="relative flex flex-col items-center gap-12">
        {problems.slice(0, 6).map((problem, index) => {
          const fromLeft = index % 2 === 0;
          const offsetX = fromLeft ? -50 : 50;

          return (
            <motion.a
              key={problem._id}
              href={`/problems`}
              initial={{ opacity: 0, x: fromLeft ? -200 : 200 }}
              whileInView={{ opacity: 1, x: offsetX }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-md rounded-3xl p-6 
                bg-gradient-to-br from-white/70 via-cyan-100/70 to-blue-50/70
                backdrop-blur-lg border border-white/40 
                shadow-2xl hover:shadow-3xl transition duration-300 hover:scale-105"
              style={{ marginLeft: fromLeft ? "-25px" : "25px" }}
            >
              <h3 className="text-xl font-bold text-gray-900 hover:text-yellow-400 transition">
                {problem.title}
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                Category:{" "}
                <span className="font-medium">{problem.category}</span>
              </p>
              <p className="text-sm mt-1">
                Difficulty:{" "}
                <span
                  className={`px-3 py-1 rounded-full font-bold ${
                    problem.difficulty === "easy"
                      ? "bg-green-100 text-green-600"
                      : problem.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-500"
                        : "bg-red-100 text-red-600"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Added: {new Date(problem.createdAt).toLocaleDateString()}
              </p>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
};

export default ProblemsSection;
