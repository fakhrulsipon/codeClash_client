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
  type: string; // "individual" or "team"
  problems: Problem[];
  description?: string;
};

type TeamMember = {
  name: string;
  email: string;
};

const ContestLobby: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (!contestId) return;

    const fetchContest = async () => {
      try {
        const res = await axios.get<Contest>(`https://code-clash-server-7f46.vercel.app/api/contests/${contestId}`);
        setContest(res.data);

        // For team contests, fetch team members (mock example)
        if (res.data.type?.toLowerCase() === "team") {
          setTeamMembers([
            { name: "Alice", email: "alice@example.com" },
            { name: "Bob", email: "bob@example.com" },
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId]);

  // Countdown timer + auto redirect
  useEffect(() => {
    if (!contest) return;

    const contestType = contest.type?.toLowerCase();

    // Individual contest: 5-second countdown
    if (contestType === "individual") {
      let counter = 5;
      setTimeLeft(`${counter}s`);

      const interval = setInterval(() => {
        counter -= 1;
        setTimeLeft(`${counter}s`);
        if (counter <= 0) {
          clearInterval(interval);
          navigate(`/contests/${contest._id}/workspace`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    // Team contest: countdown until startTime
    if (contestType === "team") {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(contest.startTime).getTime();
        const distance = start - now;

        if (distance <= 0) {
          clearInterval(interval);
          navigate(`/contests/${contest._id}/workspace`);
          return;
        }

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${minutes}m ${seconds}s`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [contest, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!contest) return <p className="text-center mt-10 text-red-500 text-lg">Contest not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <div className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 rounded-3xl p-8 shadow-2xl text-gray-800 text-center">
        <h1 className="text-3xl font-bold mb-4">{contest.title}</h1>
        <p className="text-lg mb-4">
          {contest.type?.toLowerCase() === "individual"
            ? "You will be redirected in:"
            : "Contest starts in:"}
          <span className="ml-2 font-mono bg-white/30 px-3 py-1 rounded">{timeLeft}</span>
        </p>

        {contest.type?.toLowerCase() === "team" && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Team Members</h2>
            {teamMembers.length > 0 ? (
              <ul className="space-y-1">
                {teamMembers.map((member, idx) => (
                  <li key={idx} className="bg-white/30 rounded px-3 py-1 shadow-inner">
                    {member.name} ({member.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-700">Waiting for team members...</p>
            )}
          </div>
        )}

        {contest.description && (
          <div className="bg-white/20 p-4 rounded-xl mb-6 shadow-inner text-left">
            <h2 className="font-semibold mb-2">Rules / Notes</h2>
            <p className="text-sm">{contest.description}</p>
          </div>
        )}

        <p className="text-sm text-gray-700 italic">
          You will be automatically redirected to the workspace when the contest starts.
        </p>
      </div>
    </div>
  );
};

export default ContestLobby;