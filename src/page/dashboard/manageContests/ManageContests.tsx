import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

const ManageContests = () => {
  const [search, setSearch] = useState("");

  const { data: contests = [], refetch } = useQuery({
    queryKey: ["contests"],
    queryFn: async () => {
      const res = await axios.get(
        "https://code-clash-server-7f46.vercel.app/api/contests"
      );
      return res.data;
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this contest?")) {
      await axios.delete(
        `https://code-clash-server-7f46.vercel.app/api/contests/${id}`
      );
      toast.success("Contest deleted!");
      refetch();
    }
  };

  const togglePause = async (contest: any) => {
    const updated = { paused: !contest.paused };
    await axios.put(
      `https://code-clash-server-7f46.vercel.app/api/contests/${contest._id}`,
      updated
    );
    toast.success(`Contest ${contest.paused ? "unpaused" : "paused"}!`);
    refetch();
  };

  const filtered = contests.filter((c: any) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Contests</h2>

      <input
        type="text"
        placeholder="Search contests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full"
      />

      <table className="min-w-full border bg-white rounded-lg shadow">
        <thead className="bg-blue-50">
          <tr>
            <th className="py-2 px-3 text-left">Title</th>
            <th className="py-2 px-3 text-left">Difficulty</th>
            <th className="py-2 px-3 text-left">Status</th>
            <th className="py-2 px-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((contest: any) => (
            <tr key={contest._id} className="border-t">
              <td className="py-2 px-3">{contest.title}</td>
              <td className="py-2 px-3 capitalize">{contest.difficulty}</td>
              <td className="py-2 px-3">
                {contest.paused ? "⏸️ Paused" : "🟢 Active"}
              </td>
              <td className="py-2 px-3 flex gap-2 justify-center">
                <button
                  onClick={() => togglePause(contest)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  {contest.paused ? "Unpause" : "Pause"}
                </button>
                <button
                  onClick={() => handleDelete(contest._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageContests;
