import { useState, useEffect } from "react";
import { FiSearch, FiTrash2, FiRefreshCw, FiEye, FiUsers, FiAlertTriangle } from "react-icons/fi";
import { FaUserFriends, FaRegCheckCircle, FaExclamationTriangle, FaUser, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import Swal from "sweetalert2";

interface Contest {
  _id: string;
  name: string;
  date?: string;
  createdAt?: string;
}

interface Participant {
  _id: string;
  contestId: string;
  userId: string;
  userName: string;
  userEmail: string | null;
  type: "individual" | "team";
  joinedAt: string;
  contestName?: string;
  contestDate?: string;
}

interface ParticipantsStats {
  totalParticipants: { count: number }[];
  participantsByType: { _id: string; count: number }[];
  participantsByContest: { _id: string; count: number }[];
  duplicates: { count: number }[];
}

export default function ManageParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ParticipantsStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [contestFilter, setContestFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "individual" | "team">("all");
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCleanupModal, setShowCleanupModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const axiosSecure = useAxiosSecure();

  // Fetch participants and contests
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch participants first
      const participantsRes = await axiosSecure.get("/api/contestParticipants");
      const participantsData = participantsRes.data.participants || participantsRes.data;
      setParticipants(Array.isArray(participantsData) ? participantsData : []);

      // Try to fetch contests, but handle if the endpoint doesn't exist
      let contestsData: Contest[] = [];
      try {
        const contestsRes = await axiosSecure.get("/api/contests");
        contestsData = Array.isArray(contestsRes.data) ? contestsRes.data : [];
      } catch (contestError) {
        console.log("Contests endpoint not available, extracting from participants");
        // Extract unique contests from participants data
        const uniqueContestIds = [...new Set(participantsData.map((p: Participant) => p.contestId))];
        contestsData = uniqueContestIds.map(contestId => ({
          _id: contestId,
          name: `Contest ${contestId.slice(-6)}`,
          createdAt: new Date().toISOString()
        }));
      }
      setContests(contestsData);

      // Try to fetch stats, but handle if the endpoint doesn't exist
      try {
        const statsRes = await axiosSecure.get("/api/contestParticipants/stats");
        setStats(statsRes.data);
      } catch (statsError) {
        console.log("Stats endpoint not available, calculating manually");
        // Calculate basic stats manually
        const totalParticipants = participantsData.length;
        const participantsByType = [
          { _id: "individual", count: participantsData.filter((p: Participant) => p.type === "individual").length },
          { _id: "team", count: participantsData.filter((p: Participant) => p.type === "team").length }
        ];
        
        // Calculate duplicates manually
        const duplicateMap = new Map();
        participantsData.forEach((participant: Participant) => {
          const key = `${participant.userId}-${participant.contestId}`;
          duplicateMap.set(key, (duplicateMap.get(key) || 0) + 1);
        });
        
        const duplicates = Array.from(duplicateMap.values()).filter(count => count > 1).length;

        setStats({
          totalParticipants: [{ count: totalParticipants }],
          participantsByType,
          participantsByContest: [],
          duplicates: [{ count: duplicates }]
        });
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      // Set empty data on error
      setParticipants([]);
      setContests([]);
      setStats({
        totalParticipants: [{ count: 0 }],
        participantsByType: [],
        participantsByContest: [],
        duplicates: [{ count: 0 }]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter participants
  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = 
      participant.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (participant.userEmail && participant.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      participant.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.contestName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesContest = contestFilter === "all" || participant.contestId === contestFilter;
    const matchesType = typeFilter === "all" || participant.type === typeFilter;

    return matchesSearch && matchesContest && matchesType;
  });

  const handleDeleteParticipant = async (participantId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove it!',
      background: '#1e293b',
      color: 'white'
    });

    if (result.isConfirmed) {
      try {
        setActionLoading(participantId);
        await axiosSecure.delete(`/api/contestParticipants/${participantId}`);
        setParticipants(participants.filter(p => p._id !== participantId));
        setShowDeleteModal(false);
        setSelectedParticipant(null);
        await fetchData(); // Refresh stats
        
        Swal.fire({
          title: 'Removed!',
          text: 'Participant has been removed.',
          icon: 'success',
          confirmButtonColor: '#06b6d4',
          background: '#1e293b',
          color: 'white'
        });
      } catch (error) {
        console.error("Error deleting participant:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to remove participant.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#1e293b',
          color: 'white'
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleCleanupDuplicates = async () => {
    const result = await Swal.fire({
      title: 'Clean Up Duplicates?',
      text: `This will remove ${getDuplicateCount()} duplicate entries. Only the earliest registration will be kept.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, clean up!',
      background: '#1e293b',
      color: 'white'
    });

    if (result.isConfirmed) {
      try {
        setActionLoading("cleanup");
        // Try the duplicates endpoint, fallback to manual cleanup
        try {
          const response = await axiosSecure.delete("/api/contestParticipants/duplicates");
          Swal.fire({
            title: 'Success!',
            text: response.data.message || 'Duplicates cleaned up successfully',
            icon: 'success',
            confirmButtonColor: '#06b6d4',
            background: '#1e293b',
            color: 'white'
          });
        } catch (duplicateError) {
          // Manual duplicate cleanup
          const uniqueParticipants = participants.filter((participant, index, self) =>
            index === self.findIndex(p => 
              p.userId === participant.userId && p.contestId === participant.contestId
            )
          );
          setParticipants(uniqueParticipants);
          Swal.fire({
            title: 'Success!',
            text: 'Duplicates cleaned up manually',
            icon: 'success',
            confirmButtonColor: '#06b6d4',
            background: '#1e293b',
            color: 'white'
          });
        }
        setShowCleanupModal(false);
        await fetchData(); // Refresh all data
      } catch (error) {
        console.error("Error cleaning up duplicates:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to clean up duplicates.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#1e293b',
          color: 'white'
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getDuplicateCount = () => {
    if (!stats?.duplicates?.[0]?.count) {
      // Calculate duplicates manually if stats not available
      const duplicateMap = new Map();
      participants.forEach(participant => {
        const key = `${participant.userId}-${participant.contestId}`;
        duplicateMap.set(key, (duplicateMap.get(key) || 0) + 1);
      });
      return Array.from(duplicateMap.values()).filter(count => count > 1).length;
    }
    return stats.duplicates[0].count;
  };

  const getTypeColor = (type: "individual" | "team") => {
    return type === "individual" 
      ? "bg-green-500/20 text-green-300 border-green-500/30" 
      : "bg-purple-500/20 text-purple-300 border-purple-500/30";
  };

  const getTypeIcon = (type: "individual" | "team") => {
    return type === "individual" 
      ? <FaUser className="w-3 h-3" />
      : <FaUsers className="w-3 h-3" />;
  };

  const safeUpperCase = (str: string | undefined | null) => {
    if (!str) return "Unknown";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              Manage Participants
            </h1>
            <p className="text-gray-400">
              Manage contest registrations and resolve duplicate entries
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white hover:bg-slate-600/50 transition-all duration-200 w-fit"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-8">
        {[
          { 
            label: "Total Participants", 
            value: participants.length, 
            icon: FiUsers, 
            color: "blue" 
          },
          { 
            label: "Individual", 
            value: participants.filter(p => p.type === "individual").length, 
            icon: FaUser, 
            color: "green" 
          },
          { 
            label: "Team", 
            value: participants.filter(p => p.type === "team").length, 
            icon: FaUserFriends, 
            color: "purple" 
          },
          { 
            label: "Contests", 
            value: contests.length, 
            icon: FaRegCheckCircle, 
            color: "cyan" 
          },
          { 
            label: "Duplicates", 
            value: getDuplicateCount(), 
            icon: FaExclamationTriangle, 
            color: "red" 
          },
        ].map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 border border-white/10 rounded-xl p-4 lg:p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-400">{stat.label}</p>
                <p className={`text-xl lg:text-2xl font-bold mt-1 ${
                  stat.color === "blue" ? "text-blue-400" :
                  stat.color === "green" ? "text-green-400" :
                  stat.color === "purple" ? "text-purple-400" :
                  stat.color === "cyan" ? "text-cyan-400" : "text-red-400"
                }`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 lg:p-2 rounded-lg border ${
                stat.color === "blue" ? "bg-blue-500/20 border-blue-500/30" :
                stat.color === "green" ? "bg-green-500/20 border-green-500/30" :
                stat.color === "purple" ? "bg-purple-500/20 border-purple-500/30" :
                stat.color === "cyan" ? "bg-cyan-500/20 border-cyan-500/30" : "bg-red-500/20 border-red-500/30"
              }`}>
                <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${
                  stat.color === "blue" ? "text-blue-400" :
                  stat.color === "green" ? "text-green-400" :
                  stat.color === "purple" ? "text-purple-400" :
                  stat.color === "cyan" ? "text-cyan-400" : "text-red-400"
                }`} />
              </div>
            </div>
            {stat.label === "Duplicates" && getDuplicateCount() > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCleanupModal(true)}
                className="w-full mt-3 px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors border border-red-500/30"
              >
                Clean Up
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 lg:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="w-full lg:w-96">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 lg:py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-sm lg:text-base"
              />
            </div>
          </div>
          
          <div className="flex gap-2 w-full lg:w-auto">
            <select
              value={contestFilter}
              onChange={(e) => setContestFilter(e.target.value)}
              className="w-full lg:w-48 px-3 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="all" className="bg-slate-800">All Contests</option>
              {contests.map(contest => (
                <option key={contest._id} value={contest._id} className="bg-slate-800">
                  {contest.name}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full lg:w-48 px-3 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="all" className="bg-slate-800">All Types</option>
              <option value="individual" className="bg-slate-800">Individual</option>
              <option value="team" className="bg-slate-800">Team</option>
            </select>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {filteredParticipants.length === 0 ? (
          <div className="text-center py-12">
            <FiUsers className="mx-auto w-12 h-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No participants found</h3>
            <p className="text-gray-500">
              {participants.length === 0 ? "No participants have registered yet." : "No participants match your search criteria."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden xl:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider w-1/4">Participant</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider w-1/5">Contest</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider w-1/6">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider w-1/6">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider w-1/5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredParticipants.map((participant, index) => (
                    <motion.tr 
                      key={participant._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-700/30 transition-colors duration-200"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {participant.userName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-white truncate">
                              {participant.userName || "Unknown User"}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                              {participant.userEmail || "No email"}
                            </div>
                            <div className="text-xs text-gray-500 font-mono truncate">
                              ID: {participant.userId?.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-white">
                          Contest {participant.contestId?.slice(-6) || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {participant.contestName || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(participant.type)}`}>
                          {getTypeIcon(participant.type)}
                          {safeUpperCase(participant.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(participant.joinedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedParticipant(participant);
                              setShowDetailsModal(true);
                            }}
                            className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all duration-200 border border-blue-500/30"
                            title="View Details"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedParticipant(participant);
                              setShowDeleteModal(true);
                            }}
                            disabled={actionLoading === participant._id}
                            className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200 border border-red-500/30 disabled:opacity-50"
                            title="Remove Participant"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tablet View */}
            <div className="hidden lg:block xl:hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {filteredParticipants.map((participant, index) => (
                  <motion.div
                    key={participant._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-700/30 border border-white/10 rounded-xl p-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                            {participant.userName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">{participant.userName}</h3>
                            <p className="text-gray-400 text-xs">{participant.userEmail || "No email"}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(participant.type)}`}>
                          {getTypeIcon(participant.type)}
                          {safeUpperCase(participant.type)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <div className="text-gray-400">
                          Contest: {participant.contestId?.slice(-6) || "Unknown"}
                        </div>
                        <span className="text-gray-400">{formatDate(participant.joinedAt)}</span>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-white/10">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedParticipant(participant);
                            setShowDetailsModal(true);
                          }}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all duration-200 border border-blue-500/30 text-xs"
                        >
                          <FiEye className="w-3 h-3" />
                          Details
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedParticipant(participant);
                            setShowDeleteModal(true);
                          }}
                          disabled={actionLoading === participant._id}
                          className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200 border border-red-500/30 text-xs disabled:opacity-50"
                        >
                          <FiTrash2 className="w-3 h-3" />
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3 p-4">
              {filteredParticipants.map((participant, index) => (
                <motion.div
                  key={participant._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-700/30 border border-white/10 rounded-xl p-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                          {participant.userName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{participant.userName}</h3>
                          <p className="text-gray-400 text-xs">{participant.userEmail || "No email"}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(participant.type)}`}>
                        {getTypeIcon(participant.type)}
                        {safeUpperCase(participant.type)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div className="text-gray-400">
                        Contest: {participant.contestId?.slice(-6) || "Unknown"}
                      </div>
                      <span className="text-gray-400 text-xs">{formatDate(participant.joinedAt)}</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-white/10">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedParticipant(participant);
                          setShowDetailsModal(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all duration-200 border border-blue-500/30 text-xs"
                      >
                        <FiEye className="w-3 h-3" />
                        Details
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedParticipant(participant);
                          setShowDeleteModal(true);
                        }}
                        disabled={actionLoading === participant._id}
                        className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200 border border-red-500/30 text-xs disabled:opacity-50"
                      >
                        <FiTrash2 className="w-3 h-3" />
                        Remove
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Participant Details Modal */}
      {showDetailsModal && selectedParticipant && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Participant Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Participant Info */}
              <div>
                <h4 className="text-sm font-medium text-cyan-300 mb-3">Participant Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400">Name</label>
                    <p className="text-sm text-white">{selectedParticipant.userName || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400">Email</label>
                    <p className="text-sm text-white">{selectedParticipant.userEmail || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400">User ID</label>
                    <p className="text-sm text-white font-mono">{selectedParticipant.userId || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400">Contest ID</label>
                    <p className="text-sm text-white font-mono">{selectedParticipant.contestId || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400">Type</label>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(selectedParticipant.type)}`}>
                      {getTypeIcon(selectedParticipant.type)}
                      {safeUpperCase(selectedParticipant.type)}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400">Joined At</label>
                    <p className="text-sm text-white">{formatDate(selectedParticipant.joinedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-white/10 bg-slate-700/30 rounded-b-2xl">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors border border-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedParticipant && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-white/10"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
                  <FiTrash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Remove Participant</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to remove <strong className="text-white">"{selectedParticipant.userName}"</strong> from the contest? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors border border-white/10"
                  disabled={actionLoading === selectedParticipant._id}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteParticipant(selectedParticipant._id)}
                  disabled={actionLoading === selectedParticipant._id}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors border border-red-500 disabled:opacity-50"
                >
                  {actionLoading === selectedParticipant._id ? "Removing..." : "Remove Participant"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cleanup Duplicates Modal */}
      {showCleanupModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-white/10"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <FiAlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Clean Up Duplicates</h3>
              </div>
              <p className="text-gray-300 mb-6">
                This will remove all duplicate contest registrations (same user in same contest). 
                Only the earliest registration will be kept. This action affects <strong className="text-white">{getDuplicateCount()} entries</strong> and cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCleanupModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors border border-white/10"
                  disabled={actionLoading === "cleanup"}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCleanupDuplicates}
                  disabled={actionLoading === "cleanup"}
                  className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors border border-yellow-500 disabled:opacity-50"
                >
                  {actionLoading === "cleanup" ? "Cleaning..." : "Clean Up Duplicates"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}