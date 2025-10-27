import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const AddContest = () => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [problems, setProblems] = useState<string[]>([]);
  const [contestType, setContestType] = useState<"individual" | "team">("individual");
  
  // ⭐ NEW: Team configuration state
  const [teamConfig, setTeamConfig] = useState({
    minSize: 2,
    maxSize: 4,
    requireFullTeam: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newContest = {
      title,
      startTime,
      endTime,
      problems,
      type: contestType,
      // ⭐ NEW: Include team config for team contests
      ...(contestType === "team" && { teamConfig })
    };

    try {
      const res = await fetch("http://localhost:3000/api/contests", {
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
          confirmButtonColor: "#06b6d4",
          background: '#1e293b',
          color: 'white'
        });

        // Reset form
        setTitle("");
        setStartTime("");
        setEndTime("");
        setProblems([]);
        setContestType("individual");
        setTeamConfig({ minSize: 2, maxSize: 4, requireFullTeam: false });
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Something went wrong",
          icon: "error",
          confirmButtonColor: "#ef4444",
          background: '#1e293b',
          color: 'white'
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Server Error!",
        text: "Try again later.",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
        background: '#1e293b',
        color: 'white'
      });
    }
  };

  // ⭐ NEW: Update team config when contest type changes
  const handleContestTypeChange = (type: "individual" | "team") => {
    setContestType(type);
    // Reset to defaults when switching to team
    if (type === "team") {
      setTeamConfig({ minSize: 2, maxSize: 4, requireFullTeam: false });
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Create New Contest
          </h2>
          <p className="text-gray-300 text-lg">
            Set up a new coding competition for the community
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contest Title */}
            <div>
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                Contest Title
              </label>
              <input
                type="text"
                placeholder="Enter contest title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Contest Type */}
            <div>
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                Contest Type
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="contestType"
                    value="individual"
                    checked={contestType === "individual"}
                    onChange={() => handleContestTypeChange("individual")}
                    className="w-5 h-5 text-cyan-600 focus:ring-cyan-500 border-white/20 bg-slate-700"
                  />
                  <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
                    👤 Individual
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="contestType"
                    value="team"
                    checked={contestType === "team"}
                    onChange={() => handleContestTypeChange("team")}
                    className="w-5 h-5 text-cyan-600 focus:ring-cyan-500 border-white/20 bg-slate-700"
                  />
                  <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
                    👥 Team
                  </span>
                </label>
              </div>
            </div>

            {/* ⭐ NEW: Team Configuration (Only show for team contests) */}
            {contestType === "team" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-slate-900/30 border border-cyan-500/20 rounded-xl p-6 space-y-4"
              >
                <h3 className="text-lg font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                  <span>🏆</span> Team Configuration
                </h3>
                
                {/* Team Size Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Minimum Team Size
                    </label>
                    <select
                      value={teamConfig.minSize}
                      onChange={(e) => setTeamConfig({
                        ...teamConfig,
                        minSize: parseInt(e.target.value)
                      })}
                      className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value={1} className="bg-slate-800">1 member</option>
                      <option value={2} className="bg-slate-800">2 members</option>
                      <option value={3} className="bg-slate-800">3 members</option>
                      <option value={4} className="bg-slate-800">4 members</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Maximum Team Size
                    </label>
                    <select
                      value={teamConfig.maxSize}
                      onChange={(e) => setTeamConfig({
                        ...teamConfig,
                        maxSize: parseInt(e.target.value)
                      })}
                      className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value={2} className="bg-slate-800">2 members</option>
                      <option value={3} className="bg-slate-800">3 members</option>
                      <option value={4} className="bg-slate-800">4 members</option>
                      <option value={5} className="bg-slate-800">5 members</option>
                      <option value={6} className="bg-slate-800">6 members</option>
                    </select>
                  </div>
                </div>

                {/* Validation for min/max */}
                {teamConfig.minSize > teamConfig.maxSize && (
                  <div className="text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    ⚠️ Minimum size cannot be greater than maximum size
                  </div>
                )}

                {/* Full Team Requirement */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="requireFullTeam"
                    checked={teamConfig.requireFullTeam}
                    onChange={(e) => setTeamConfig({
                      ...teamConfig,
                      requireFullTeam: e.target.checked
                    })}
                    className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 rounded bg-slate-700 border-white/20"
                  />
                  <label htmlFor="requireFullTeam" className="text-sm font-medium text-gray-300">
                    Require full team to start contest
                  </label>
                </div>

                {/* Configuration Summary */}
                <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-3 mt-2">
                  <p className="text-sm text-cyan-300 font-medium">
                    📋 Teams will need {teamConfig.minSize}-{teamConfig.maxSize} members
                    {teamConfig.requireFullTeam && " (full team required to start)"}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Start Time */}
            <div>
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                End Time
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Problems */}
            <div>
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                Problem IDs
              </label>
              <input
                type="text"
                placeholder="Example: 1,2,3"
                value={problems.join(",")}
                onChange={(e) => setProblems(e.target.value.split(","))}
                className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-gray-400 mt-2">
                Enter problem IDs separated by commas.
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={contestType === "team" && teamConfig.minSize > teamConfig.maxSize}
              whileHover={{ scale: contestType === "team" && teamConfig.minSize > teamConfig.maxSize ? 1 : 1.02 }}
              whileTap={{ scale: contestType === "team" && teamConfig.minSize > teamConfig.maxSize ? 1 : 0.98 }}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                contestType === "team" && teamConfig.minSize > teamConfig.maxSize
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white shadow-2xl hover:shadow-cyan-500/25"
              }`}
            >
              {contestType === "team" && teamConfig.minSize > teamConfig.maxSize
                ? "Fix Team Configuration"
                : "Create Contest"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddContest;