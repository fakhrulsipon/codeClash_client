import { useState } from "react";
import Swal from "sweetalert2"; // <-- import SweetAlert2

const AddContest = () => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [problems, setProblems] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newContest = { title, startTime, endTime, problems };

    try {
      const res = await fetch("http://localhost:3000/api/contests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContest),
      });

      const data = await res.json();
      if (res.ok) {
        // SweetAlert2 success
        Swal.fire({
          title: "Success!",
          text: "Contest created successfully!",
          icon: "success",
          confirmButtonColor: "#2563EB",
        });

        // reset form
        setTitle("");
        setStartTime("");
        setEndTime("");
        setProblems([]);
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-extrabold text-center text-blue-700 mb-6">
          Add New Contest
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter problem IDs separated by commas.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Create Contest
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContest;
