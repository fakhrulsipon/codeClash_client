import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import Modal from "react-modal";

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
  type: string; // "individual" or "team"
  problems: Problem[];
  description?: string;
};

const ContestDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

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

  const now = new Date().getTime();
  const start = new Date(contest.startTime).getTime();
  const end = new Date(contest.endTime).getTime();

  const status: "Upcoming" | "Running" | "Finished" =
    now < start ? "Upcoming" : now > end ? "Finished" : "Running";

  const handleJoinClick = () => {
    if (contest.type.toLowerCase() === "individual") {
      setModalOpen(true); // open modal for individual contests
    } else {
      navigate(`/contests/${contest._id}/join`); // team contest → join page
    }
  };

  const confirmJoinIndividual = () => {
    setModalOpen(false);
    navigate(`/contests/${contest._id}/lobby`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="rounded-3xl p-6 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-400 shadow-2xl backdrop-blur-lg text-gray-800 relative hover:scale-[1.02] transition-transform duration-300">
        {/* Status Badge */}
        <span
          className={`absolute top-4 right-4 px-4 py-1 rounded-full font-semibold shadow-lg ${status === "Upcoming" ? "bg-yellow-300 text-yellow-900" : status === "Running" ? "bg-green-300 text-green-900" : "bg-gray-300 text-gray-900"}`}
        >
          {status}
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

        {/* ✅ Join Contest Button */}
        <button
          disabled={status === "Finished"}
          onClick={handleJoinClick}
          className={`px-6 py-3 rounded-full font-bold shadow-lg transition-transform duration-200 ${
            status === "Finished"
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white text-purple-700 hover:scale-105"
          }`}
        >
          {status === "Finished" ? "Contest Ended" : "Join Contest"}
        </button>
      </div>

      {/* Modal for Individual Contest Confirmation */}
      {/* Modal for Individual Contest Confirmation */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        className="bg-gradient-to-tr from-purple-400 via-pink-300 to-indigo-400 rounded-3xl p-8 shadow-2xl max-w-md mx-auto relative animate-fade-in"
      >
        {/* Close button */}
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-4 right-4 text-white font-bold text-xl hover:text-gray-200"
        >
          &times;
        </button>

        <div className="text-center text-gray-200">
          <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow-lg">
            {contest.title}
          </h2>
          <p className="text-white/90 mb-6 text-lg">
            You are about to join this individual contest. Make sure you are
            ready to compete!
          </p>

         
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setModalOpen(false)}
              className="px-5 py-2 rounded-full bg-white/30 text-white font-semibold hover:bg-white/50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmJoinIndividual}
              className="px-5 py-2 rounded-full bg-white text-purple-700 font-bold hover:scale-105 hover:shadow-lg transition-all duration-200"
            >
              Confirm Join
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContestDetails;
