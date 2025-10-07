import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiPause, FiPlay, FiTrash2, FiSearch } from "react-icons/fi";

const ManageContests = () => {
  const [search, setSearch] = useState("");

  const {
    data: contests = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["contests"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/contests");
      return res.data;
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this contest?")) {
      await axios.delete(`http://localhost:3000/api/contests/${id}`);
      toast.success("Contest deleted!");
      refetch();
    }
  };

  const togglePause = async (contest: any) => {
    const updated = { paused: !contest.paused };
    await axios.put(
      `http://localhost:3000/api/contests/${contest._id}`,
      updated
    );
    toast.success(`Contest ${contest.paused ? "unpaused" : "paused"}!`);
    refetch();
  };

  const filtered = contests.filter((c: any) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-xl shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-3xl font-semibold text-gray-800">
          Manage Contests 🏁
        </h2>

        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search contests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Difficulty</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((contest: any, idx: number) => (
              <motion.tr
                key={contest._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b hover:bg-blue-50 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-gray-800">
                  {contest.title}
                </td>
                <td className="py-2 px-3 capitalize">
                  {contest.problems && contest.problems.length > 0 ? (
                    <span>
                      {[
                        ...new Set(
                          contest.problems.map((p: any) => p.difficulty)
                        ),
                      ].join(", ")}
                    </span>
                  ) : (
                    <span className="text-gray-400">No problems</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {contest.paused ? (
                    <span className="text-yellow-600 font-semibold flex items-center gap-1">
                      <FiPause /> Paused
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <FiPlay /> Active
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 flex gap-2 justify-center">
                  <button
                    onClick={() => togglePause(contest)}
                    className={`px-3 py-1 rounded-lg text-white text-sm flex items-center gap-1 transition-colors ${
                      contest.paused
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    {contest.paused ? <FiPlay /> : <FiPause />}
                    {contest.paused ? "Unpause" : "Pause"}
                  </button>

                  <button
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm flex items-center gap-1"
                    onClick={() => toast("Edit feature coming soon ✏️")}
                  >
                    <FiEdit /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(contest._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm flex items-center gap-1"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No contests found 😕</p>
      )}
    </motion.div>
  );
};

export default ManageContests;
