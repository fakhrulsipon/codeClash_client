import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { AuthContext } from "../provider/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hook/useAxiosSecure";

interface Submission {
  _id: string;
  userEmail: string;
  userName: string;
  status: string;
  problemTitle: string;
  problemDifficulty: string;
  problemCategory: string;
  point: number;
  submittedAt: string;
}

const History = () => {
  const { user } = use(AuthContext)!;
  const email = user?.email || user?.providerData[0].email;
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError } = useQuery<Submission[]>({
    queryKey: ["submissions", email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/users/submissions/${email}`);
      return res.data;
    },
    enabled: !!email,
  });

  if (isLoading) return <LoadingSpinner />;

  // যদি ডাটা ফাঁকা হয় বা কিছু না আসে
  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-6 bg-gray-50">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
          alt="no submissions"
          className="w-40 h-40 mb-6 opacity-80"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No Submissions Yet
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          You haven’t submitted any problem solutions yet.  
          Start solving problems and your history will appear here!
        </p>
        <a
          href="/problems"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          Solve Your First Problem 🚀
        </a>
      </div>
    );
  }

  if (isError)
    return (
      <p className="text-center py-4 text-red-500">
        Error loading submissions
      </p>
    );

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Submission History</h1>

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse w-full shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Problem Title</th>
              <th className="px-4 py-2 text-left">Difficulty</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Submitted At</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((submission, idx) => (
              <tr
                key={submission._id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2 font-medium">{submission.problemTitle}</td>
                <td className="px-4 py-2 capitalize">{submission.problemDifficulty}</td>
                <td className="px-4 py-2 capitalize">{submission.problemCategory}</td>
                <td className="px-4 py-2">
                  {new Date(submission.submittedAt).toLocaleString()}
                </td>
                <td
                  className={`px-4 py-2 font-bold ${
                    submission.status === "Success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {submission.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
