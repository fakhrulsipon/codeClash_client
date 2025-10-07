import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { use } from "react";
import { AuthContext } from "../provider/AuthProvider";

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
  const {user} = use(AuthContext)!
  const email = user?.email || user?.providerData[0].email;


  const { data, isLoading, isError } = useQuery<Submission[]>({
    queryKey: ["submissions", email],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3000/api/users/submissions/${email}`
      );
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-4">Loading...</p>;
  if (isError) return <p className="text-center py-4 text-red-500">Error loading submissions</p>;

  return (
    <div className="p-4 md:p-6 lg:p-8">
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
            {data?.map((submission, idx) => (
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
                  className={`px-4 py-2 font-semibold ${
                    submission.status === "Success"
                      ? "text-green-600"
                      : "text-red-600"
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
