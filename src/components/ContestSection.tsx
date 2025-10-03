import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import LoadingSpinner from "./LoadingSpinner";

type Problem = {
  _id: string;
  title: string;
  description: string;
};

type Contest = {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  problems: Problem[];
  createdAt: string;
};

const ContestSection: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 400, easing: "ease-in-out", once: false });
    const fetchContests = async () => {
      try {
        const res = await axios.get<Contest[]>(
          "http://localhost:3000/api/contests"
        );
        const sorted = res.data
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);
        setContests(sorted);
      } catch (err) {
        console.error("Failed to fetch contests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute top-0 left-1/2 w-[500px] h-[500px] rounded-full bg-blue-300 opacity-30 filter blur-3xl -translate-x-1/2 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-200 opacity-20 filter blur-3xl"></div>

      {/* Section header */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-blue-800 drop-shadow-lg mb-4">
        Latest Coding Contests
      </h2>
      <p className="text-center text-lg md:text-xl text-blue-700/90 mb-16 max-w-3xl mx-auto">
        Join the latest coding challenges, test your skills, and compete with
        developers around the world. Stay sharp and climb the leaderboard!
      </p>

      {/* Contest cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {contests.map((contest, idx) => (
          <div
            key={contest._id}
            data-aos={idx % 2 === 0 ? "fade-up-right" : "fade-up-left"}
            className="relative rounded-3xl p-6 bg-gradient-to-br from-white/80 via-cyan-100/80 to-blue-50/80
                       backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-3xl transition-transform duration-300 hover:scale-105"
          >
            <h3 className="text-2xl font-bold text-blue-700 mb-3">
              {contest.title}
            </h3>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Start:</strong>{" "}
              {new Date(contest.startTime).toLocaleString()}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>End:</strong> {new Date(contest.endTime).toLocaleString()}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Problems:</strong> {contest.problems.length}
            </p>
            <p className="text-xs text-gray-500">
              Created: {new Date(contest.createdAt).toLocaleDateString()}
            </p>
            <a
              href={`/contests/${contest._id}`}
              className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-200"
            >
              View Contest
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContestSection;
