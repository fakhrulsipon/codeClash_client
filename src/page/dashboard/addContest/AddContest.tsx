import { useState } from "react";
import Swal from "sweetalert2"; // SweetAlert2

const AddContest = () => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [problems, setProblems] = useState<string[]>([]);
  const [contestType, setContestType] = useState<"individual" | "team">(
    "individual"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newContest = {
      title,
      startTime,
      endTime,
      problems,
      type: contestType,
    };

    try {
      const res = await fetch("https://code-clash-server-7f46.vercel.app/api/contests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContest),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          title: "Success!",
          text: "Contest created successfully!",
          icon: "success",
          confirmButtonColor: "#2563EB",
        });

        // Reset form
        setTitle("");
        setStartTime("");
        setEndTime("");
        setProblems([]);
        setContestType("individual");
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Something went wrong",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Server Error!",
        text: "Try again later.",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-8">
          Add New Contest
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contest Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contest Title
            </label>
            <input
              type="text"
              placeholder="Enter contest title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          {/* Contest Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contest Type
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="contestType"
                  value="individual"
                  checked={contestType === "individual"}
                  onChange={() => setContestType("individual")}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700 font-medium">Individual</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="contestType"
                  value="team"
                  checked={contestType === "team"}
                  onChange={() => setContestType("team")}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700 font-medium">Team</span>
              </label>
            </div>
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          {/* Problems */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Problem IDs
            </label>
            <input
              type="text"
              placeholder="Example: 1,2,3"
              value={problems.join(",")}
              onChange={(e) => setProblems(e.target.value.split(","))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter problem IDs separated by commas.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-200"
          >
            Create Contest
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContest;
