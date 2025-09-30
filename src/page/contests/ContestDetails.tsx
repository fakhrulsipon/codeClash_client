import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
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
  type: string;
  description?: string;
};

const ContestDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get<Contest>(
          `http://localhost:3000/api/contests/${id}`
        );
        setContest(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!contest) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(contest.startTime).getTime();
      const end = new Date(contest.endTime).getTime();
      let distance: number;
      let prefix: string;

      if (now < start) {
        distance = start - now;
        prefix = "Starts in: ";
      } else if (now >= start && now <= end) {
        distance = end - now;
        prefix = "Ends in: ";
      } else {
        setTimeLeft("Contest ended");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        days > 0
          ? `${prefix}${days}d ${hours}h ${minutes}m ${seconds}s`
          : `${prefix}${hours}h ${minutes}m ${seconds}s`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  if (loading) return <LoadingSpinner />;

  if (!contest)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        Contest not found.
      </p>
    );

  const getStatus = () => {
    const now = new Date().getTime();
    if (now < new Date(contest.startTime).getTime()) return "Upcoming";
    if (now > new Date(contest.endTime).getTime()) return "Finished";
    return "Running";
  };

  const statusColors: Record<string, string> = {
    Upcoming: "bg-yellow-300 text-yellow-900",
    Running: "bg-green-300 text-green-900",
    Finished: "bg-gray-300 text-gray-900",
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div
        className="rounded-3xl p-6 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-400
                      shadow-2xl backdrop-blur-lg text-gray-800 relative hover:scale-[1.02] transition-transform duration-300"
      >
        {/* Status Badge */}
        <span
          className={`absolute top-4 right-4 px-4 py-1 rounded-full font-semibold shadow-lg ${statusColors[getStatus()]}`}
        >
          {getStatus()}
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 drop-shadow-sm">
          {contest.title}
        </h1>

        <p className="text-sm sm:text-base mb-2">
          <strong>Type:</strong> {contest.type} | <strong>Created:</strong>{" "}
          {new Date(contest.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm sm:text-base mb-4">
          <strong>Start:</strong> {new Date(contest.startTime).toLocaleString()}{" "}
          | <strong>End:</strong> {new Date(contest.endTime).toLocaleString()}
        </p>

        <p className="text-lg font-medium mb-6">
          <strong>Time Left:</strong>{" "}
          <span className="bg-white/30 text-gray-800 px-2 py-1 rounded">
            {timeLeft}
          </span>
        </p>

        {contest.description && (
          <p className="mb-6 bg-white/20 text-gray-900 p-4 rounded-xl shadow-inner">
            {contest.description}
          </p>
        )}

        <h2 className="text-2xl font-bold mb-4">Problems</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {contest.problems.map((p) => (
            <div
              key={p._id}
              className="p-4 bg-white/30 text-gray-800 rounded-xl shadow-md backdrop-blur-sm hover:scale-105 transition-transform duration-200"
            >
              <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
              <p className="text-sm mb-2">{p.description}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-blue-200 text-blue-900 rounded-full text-xs font-medium">
                  Difficulty: {p.difficulty}
                </span>
                <span className="px-2 py-1 bg-purple-200 text-purple-900 rounded-full text-xs font-medium">
                  Category: {p.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate(`/contest/${contest._id}/join`)}
          className="px-6 py-3 bg-white text-purple-700 font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
        >
          Join Contest
        </button>
      </div>
    </div>
  );
};

export default ContestDetails;
