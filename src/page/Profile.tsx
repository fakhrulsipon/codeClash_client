import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../provider/AuthProvider";
import CountUp from "react-countup";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { FaStar, FaCheckCircle, FaTimesCircle, FaClipboardList } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hook/useAxiosSecure";

type Growth = { date: string; count: number };

type UserPoints = {
  email: string;
  totalPoints: number;
  totalSubmissions: number;
  successCount: number;
  failureCount: number;
  growth: Growth[];
};

const COLORS = ["#4CAF50", "#F44336"];

const Profile: React.FC = () => {
  const { user } = use(AuthContext)!;
  const email = user?.email || user?.providerData[0].email;
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, error } = useQuery<UserPoints>({
    queryKey: ["userPoints", email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/users/profile/${email}`);
      return res.data;
    },
    enabled: !!email,
  });

  if (isLoading) return <LoadingSpinner />;


  if (error)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        Failed to load data. Please try again later.
      </p>
    );


  if (
    !data ||
    (data.totalPoints === 0 &&
      data.totalSubmissions === 0 &&
      data.successCount === 0 &&
      data.failureCount === 0)
  ) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-6 bg-gray-50">
        <img
          src="https://i.ibb.co/5Y3zM9F/empty-state.png"
          alt="No data"
          className="w-48 h-48 mb-6 opacity-80"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No Activity Yet
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          You haven’t solved any problems yet. Start solving to see your progress
          and earn points!
        </p>
        <a
          href="/problems"
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          Solve Your First Problem 🚀
        </a>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-12">
        <img
          src={user?.photoURL || "https://i.ibb.co/2y7QbZk/user.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md mb-4 object-cover"
        />
        <h1 className="text-4xl font-extrabold text-gray-800">
          {user?.displayName || "Anonymous User"}
        </h1>
        <p className="text-gray-600 text-lg mb-4">{user?.email}</p>
        <p className="text-gray-700 text-center max-w-xl text-sm md:text-base">
          Welcome to your profile! Track your progress, view your stats, and stay motivated to solve more problems every day.
        </p>
      </div>

      {/* Stats Section */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        <div className="flex-1 min-w-[140px] bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
          <FaStar className="text-yellow-400 mx-auto mb-2 text-2xl" />
          <h2 className="text-3xl font-bold text-gray-800">
            <CountUp end={data?.totalPoints ?? 0} duration={2} />
          </h2>
          <p className="text-gray-600 text-sm">Total Points</p>
        </div>
        <div className="flex-1 min-w-[140px] bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
          <FaClipboardList className="text-blue-400 mx-auto mb-2 text-2xl" />
          <h2 className="text-3xl font-bold text-gray-800">
            <CountUp end={data?.totalSubmissions ?? 0} duration={2} />
          </h2>
          <p className="text-gray-600 text-sm">Submissions</p>
        </div>
        <div className="flex-1 min-w-[140px] bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
          <FaCheckCircle className="text-green-400 mx-auto mb-2 text-2xl" />
          <h2 className="text-3xl font-bold text-gray-800">
            <CountUp end={data?.successCount ?? 0} duration={2} />
          </h2>
          <p className="text-gray-600 text-sm">Success</p>
        </div>
        <div className="flex-1 min-w-[140px] bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
          <FaTimesCircle className="text-red-400 mx-auto mb-2 text-2xl" />
          <h2 className="text-3xl font-bold text-gray-800">
            <CountUp end={data?.failureCount ?? 0} duration={2} />
          </h2>
          <p className="text-gray-600 text-sm">Failure</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
            Success vs Failure
          </h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Success", value: data?.successCount ?? 0 },
                    { name: "Failure", value: data?.failureCount ?? 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
            Problem Solving Growth
          </h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.growth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Static Motivational Text */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Tips to Improve Your Score
        </h2>
        <ul className="list-disc list-inside text-gray-700 text-base md:text-lg space-y-1">
          <li>Try solving at least one problem every day.</li>
          <li>Review failed submissions to learn from mistakes.</li>
          <li>Focus on both speed and accuracy.</li>
          <li>Participate in contests regularly to challenge yourself.</li>
          <li>Collaborate with peers and discuss strategies.</li>
        </ul>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mb-16">
        <a
          href="/problems"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Solve More Problems 🚀
        </a>
      </div>

      <p className="text-center text-gray-500 italic mb-6">
        Keep pushing your limits and track your growth over time!
      </p>
    </div>
  );
};

export default Profile;
