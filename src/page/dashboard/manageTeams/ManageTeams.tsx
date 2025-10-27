import { useState, useEffect } from "react";
import { FiSearch, FiTrash2, FiRefreshCw, FiEye } from "react-icons/fi";
import { FaUserFriends, FaRegCheckCircle, FaRegTimesCircle, FaCrown, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import Swal from "sweetalert2";

interface TeamMember {
  userId: string;
  userName: string;
  userImage?: string;
  role: "leader" | "member";
  ready: boolean;
  joinedAt: string;
}

interface Team {
  _id: string;
  name: string;
  contestId: string;
  code: string;
  createdBy: string;
  members: TeamMember[];
  status: "waiting" | "ready" | "started" | "completed";
  readyAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ManageTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "waiting" | "ready" | "started" | "completed">("all");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const axiosSecure = useAxiosSecure();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/api/teams");
      const teamsData = response.data.teams || response.data;
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.members.some(member => 
                           member.userName.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesStatus = statusFilter === "all" || team.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteTeam = async (teamId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e293b',
      color: 'white'
    });

    if (result.isConfirmed) {
      try {
        setActionLoading(teamId);
        await axiosSecure.delete(`/api/teams/${teamId}`);
        setTeams(teams.filter(team => team._id !== teamId));
        setShowDeleteModal(false);
        setSelectedTeam(null);
        Swal.fire({
          title: 'Deleted!',
          text: 'Team has been deleted.',
          icon: 'success',
          confirmButtonColor: '#06b6d4',
          background: '#1e293b',
          color: 'white'
        });
      } catch (error) {
        console.error("Error deleting team:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete team.',
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

  const handleUpdateTeamStatus = async (teamId: string, newStatus: Team["status"]) => {
    try {
      setActionLoading(teamId);
      await axiosSecure.patch(`/api/teams/${teamId}/status`, { status: newStatus });
      
      setTeams(teams.map(team => 
        team._id === teamId ? { ...team, status: newStatus } : team
      ));
      
      Swal.fire({
        title: 'Success!',
        text: `Team status updated to ${newStatus}`,
        icon: 'success',
        confirmButtonColor: '#06b6d4',
        background: '#1e293b',
        color: 'white'
      });
    } catch (error) {
      console.error("Error updating team status:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update team status.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#1e293b',
        color: 'white'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: Team["status"]) => {
    switch (status) {
      case "waiting": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "ready": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "started": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "completed": return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: Team["status"]) => {
    switch (status) {
      case "waiting": return <FaRegTimesCircle className="w-3 h-3" />;
      case "ready": return <FaRegCheckCircle className="w-3 h-3" />;
      case "started": return <FiRefreshCw className="w-3 h-3" />;
      case "completed": return <FaRegCheckCircle className="w-3 h-3" />;
      default: return <FaRegTimesCircle className="w-3 h-3" />;
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

  const safeUpperCase = (str: string | undefined | null) => {
    if (!str) return "Unknown";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Function to handle view details
  const handleViewDetails = (team: Team) => {
    setSelectedTeam(team);
    setShowDetailsModal(true);
  };

  // Function to handle delete confirmation
  const handleDeleteConfirmation = (team: Team) => {
    setSelectedTeam(team);
    setShowDeleteModal(true);
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
              Manage Teams
            </h1>
            <p className="text-gray-400">
              Manage and monitor all programming teams in the system
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchTeams}
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
          { label: "Total Teams", value: teams.length, icon: FaUserFriends, color: "blue" },
          { label: "Waiting", value: teams.filter(t => t.status === "waiting").length, icon: FaRegTimesCircle, color: "yellow" },
          { label: "Ready", value: teams.filter(t => t.status === "ready").length, icon: FaRegCheckCircle, color: "green" },
          { label: "Started", value: teams.filter(t => t.status === "started").length, icon: FiRefreshCw, color: "blue" },
          { label: "Completed", value: teams.filter(t => t.status === "completed").length, icon: FaRegCheckCircle, color: "gray" },
        ].map((stat, index) => (
          <div key={index} className="bg-slate-800/50 border border-white/10 rounded-xl p-4 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-400">{stat.label}</p>
                <p className={`text-xl lg:text-2xl font-bold mt-1 ${
                  stat.color === "blue" ? "text-blue-400" :
                  stat.color === "yellow" ? "text-yellow-400" :
                  stat.color === "green" ? "text-green-400" : "text-gray-400"
                }`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 lg:p-2 rounded-lg border ${
                stat.color === "blue" ? "bg-blue-500/20 border-blue-500/30" :
                stat.color === "yellow" ? "bg-yellow-500/20 border-yellow-500/30" :
                stat.color === "green" ? "bg-green-500/20 border-green-500/30" : "bg-gray-500/20 border-gray-500/30"
              }`}>
                <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${
                  stat.color === "blue" ? "text-blue-400" :
                  stat.color === "yellow" ? "text-yellow-400" :
                  stat.color === "green" ? "text-green-400" : "text-gray-400"
                }`} />
              </div>
            </div>
          </div>
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
                placeholder="Search by team name, code, or member..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 lg:py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-sm lg:text-base"
              />
            </div>
          </div>
          
          <div className="flex gap-2 w-full lg:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full lg:w-48 px-3 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="all" className="bg-slate-800">All Status</option>
              <option value="waiting" className="bg-slate-800">Waiting</option>
              <option value="ready" className="bg-slate-800">Ready</option>
              <option value="started" className="bg-slate-800">Started</option>
              <option value="completed" className="bg-slate-800">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12">
            <FaUserFriends className="mx-auto w-12 h-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No teams found</h3>
            <p className="text-gray-500">
              {teams.length === 0 ? "No teams have been created yet." : "No teams match your search criteria."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden xl:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider w-1/4">Team</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider w-1/5">Members</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider w-1/6">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider w-1/6">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider w-1/5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTeams.map((team, index) => (
                    <motion.tr 
                      key={team._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-700/30 transition-colors duration-200"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {team.name?.charAt(0)?.toUpperCase() || "T"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-white truncate">
                              {team.name || "Unnamed Team"}
                            </div>
                            <div className="text-xs text-gray-400 font-mono truncate">
                              Code: {team.code || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {team.members?.slice(0, 3).map((member, index) => (
                              <div
                                key={member.userId || index}
                                className="w-7 h-7 bg-slate-600 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
                                title={member.userName || "Unknown User"}
                              >
                                {member.userImage ? (
                                  <img
                                    src={member.userImage}
                                    alt={member.userName || "User"}
                                    className="w-full h-full rounded-full"
                                  />
                                ) : (
                                  (member.userName?.charAt(0) || "U").toUpperCase()
                                )}
                              </div>
                            ))}
                            {team.members && team.members.length > 3 && (
                              <div className="w-7 h-7 bg-slate-700 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs font-medium text-gray-300 flex-shrink-0">
                                +{team.members.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {team.members?.length || 0} member{(team.members?.length || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(team.status)}`}>
                          {getStatusIcon(team.status)}
                          {safeUpperCase(team.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(team.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewDetails(team)}
                            className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all duration-200 border border-blue-500/30"
                            title="View Details"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                          </motion.button>
                          
                          {team.status !== "completed" && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUpdateTeamStatus(team._id, "completed")}
                              disabled={actionLoading === team._id}
                              className="p-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all duration-200 border border-green-500/30 disabled:opacity-50"
                              title="Mark as Completed"
                            >
                              <FaRegCheckCircle className="w-3.5 h-3.5" />
                            </motion.button>
                          )}
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteConfirmation(team)}
                            disabled={actionLoading === team._id}
                            className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200 border border-red-500/30 disabled:opacity-50"
                            title="Delete Team"
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
                {filteredTeams.map((team, index) => (
                  <motion.div
                    key={team._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-700/30 border border-white/10 rounded-xl p-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                            {team.name?.charAt(0)?.toUpperCase() || "T"}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">{team.name || "Unnamed Team"}</h3>
                            <p className="text-gray-400 text-xs font-mono">Code: {team.code}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(team.status)}`}>
                          {getStatusIcon(team.status)}
                          {safeUpperCase(team.status)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1">
                            {team.members?.slice(0, 3).map((member, index) => (
                              <div
                                key={member.userId || index}
                                className="w-6 h-6 bg-slate-600 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs font-medium text-white"
                              >
                                {(member.userName?.charAt(0) || "U").toUpperCase()}
                              </div>
                            ))}
                          </div>
                          <span className="text-gray-400">
                            {team.members?.length || 0} members
                          </span>
                        </div>
                        <span className="text-gray-400">{formatDate(team.createdAt)}</span>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-white/10">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewDetails(team)}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all duration-200 border border-blue-500/30 text-xs"
                        >
                          <FiEye className="w-3 h-3" />
                          Details
                        </motion.button>

                        {team.status !== "completed" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUpdateTeamStatus(team._id, "completed")}
                            disabled={actionLoading === team._id}
                            className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all duration-200 border border-green-500/30 text-xs disabled:opacity-50"
                          >
                            <FaRegCheckCircle className="w-3 h-3" />
                            Complete
                          </motion.button>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteConfirmation(team)}
                          disabled={actionLoading === team._id}
                          className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200 border border-red-500/30 text-xs disabled:opacity-50"
                        >
                          <FiTrash2 className="w-3 h-3" />
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3 p-4">
              {filteredTeams.map((team, index) => (
                <motion.div
                  key={team._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-700/30 border border-white/10 rounded-xl p-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                          {team.name?.charAt(0)?.toUpperCase() || "T"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{team.name || "Unnamed Team"}</h3>
                          <p className="text-gray-400 text-xs font-mono">Code: {team.code}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(team.status)}`}>
                        {getStatusIcon(team.status)}
                        {safeUpperCase(team.status)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {team.members?.slice(0, 3).map((member, index) => (
                            <div
                              key={member.userId || index}
                              className="w-6 h-6 bg-slate-600 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs font-medium text-white"
                            >
                              {(member.userName?.charAt(0) || "U").toUpperCase()}
                            </div>
                          ))}
                        </div>
                        <span className="text-gray-400">
                          {team.members?.length || 0} members
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">{formatDate(team.createdAt)}</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-white/10">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDetails(team)}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all duration-200 border border-blue-500/30 text-xs"
                      >
                        <FiEye className="w-3 h-3" />
                        Details
                      </motion.button>

                      {team.status !== "completed" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdateTeamStatus(team._id, "completed")}
                          disabled={actionLoading === team._id}
                          className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all duration-200 border border-green-500/30 text-xs disabled:opacity-50"
                        >
                          <FaRegCheckCircle className="w-3 h-3" />
                          Complete
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteConfirmation(team)}
                        disabled={actionLoading === team._id}
                        className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200 border border-red-500/30 text-xs disabled:opacity-50"
                      >
                        <FiTrash2 className="w-3 h-3" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Team Details Modal - FIXED */}
      {showDetailsModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Team Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Team Info */}
              <div>
                <h4 className="text-sm font-medium text-cyan-300 mb-3">Team Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400">Team Name</label>
                    <p className="text-sm text-white">{selectedTeam.name || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400">Team Code</label>
                    <p className="text-sm text-white font-mono">{selectedTeam.code || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400">Status</label>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedTeam.status)}`}>
                      {getStatusIcon(selectedTeam.status)}
                      {safeUpperCase(selectedTeam.status)}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400">Created</label>
                    <p className="text-sm text-white">{formatDate(selectedTeam.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div>
                <h4 className="text-sm font-medium text-cyan-300 mb-3">Team Members ({selectedTeam.members?.length || 0})</h4>
                <div className="space-y-3">
                  {selectedTeam.members?.map((member) => (
                    <div key={member.userId} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                          {member.userImage ? (
                            <img
                              src={member.userImage}
                              alt={member.userName || "User"}
                              className="w-full h-full rounded-full"
                            />
                          ) : (
                            (member.userName?.charAt(0) || "U").toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white flex items-center gap-1">
                            {member.userName || "Unknown User"}
                            {member.role === "leader" && (
                              <FaCrown className="w-3 h-3 text-yellow-400" />
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            Joined: {formatDate(member.joinedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          member.ready ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                        }`}>
                          {member.ready ? "Ready" : "Not Ready"}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          member.role === "leader" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}>
                          {member.role === "leader" ? <FaCrown className="w-3 h-3" /> : <FaUser className="w-3 h-3" />}
                          {safeUpperCase(member.role)}
                        </span>
                      </div>
                    </div>
                  ))}
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

      {/* Delete Confirmation Modal - FIXED */}
      {showDeleteModal && selectedTeam && (
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
                <h3 className="text-lg font-semibold text-white">Delete Team</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete the team <strong className="text-white">"{selectedTeam.name}"</strong>? This action cannot be undone and all team data will be permanently removed.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors border border-white/10"
                  disabled={actionLoading === selectedTeam._id}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTeam(selectedTeam._id)}
                  disabled={actionLoading === selectedTeam._id}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors border border-red-500 disabled:opacity-50"
                >
                  {actionLoading === selectedTeam._id ? "Deleting..." : "Delete Team"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}