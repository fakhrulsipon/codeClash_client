import { useState, useEffect } from "react";
import { FiSearch, FiTrash2, FiRefreshCw, FiEye } from "react-icons/fi";
import {
  FaUserFriends,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaCrown,
  FaUser,
} from "react-icons/fa";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import useAxiosPublic from "../../../hook/useAxiosPublic";

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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "waiting" | "ready" | "started" | "completed"
  >("all");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  // Fetch teams from API
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get("/api/teams");
      // Handle both response formats
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

  // Filter teams based on search and filter criteria
  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.members.some((member) =>
        member.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || team.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteTeam = async (teamId: string) => {
    try {
      setActionLoading(teamId);
      await axiosSecure.delete(`/api/teams/${teamId}`);
      setTeams(teams.filter((team) => team._id !== teamId));
      setShowDeleteModal(false);
      setSelectedTeam(null);
    } catch (error) {
      console.error("Error deleting team:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateTeamStatus = async (
    teamId: string,
    newStatus: Team["status"]
  ) => {
    try {
      setActionLoading(teamId);
      await axiosSecure.patch(`/api/teams/${teamId}/status`, {
        status: newStatus,
      });

      // Update local state
      setTeams(
        teams.map((team) =>
          team._id === teamId ? { ...team, status: newStatus } : team
        )
      );
    } catch (error) {
      console.error("Error updating team status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: Team["status"]) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "started":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: Team["status"]) => {
    switch (status) {
      case "waiting":
        return <FaRegTimesCircle className="w-4 h-4" />;
      case "ready":
        return <FaRegCheckCircle className="w-4 h-4" />;
      case "started":
        return <FiRefreshCw className="w-4 h-4" />;
      case "completed":
        return <FaRegCheckCircle className="w-4 h-4" />;
      default:
        return <FaRegTimesCircle className="w-4 h-4" />;
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

  // Safe string manipulation
  const safeUpperCase = (str: string | undefined | null) => {
    if (!str) return "Unknown";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FaUserFriends className="text-blue-600" />
                Manage Teams
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and monitor all programming teams in the system
              </p>
            </div>
            <button
              onClick={fetchTeams}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teams</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {teams.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUserFriends className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waiting</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {teams.filter((t) => t.status === "waiting").length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaRegTimesCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {teams.filter((t) => t.status === "ready").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaRegCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Started</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {teams.filter((t) => t.status === "started").length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiRefreshCw className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">
                  {teams.filter((t) => t.status === "completed").length}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <FaRegCheckCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by team name, code, or member..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="waiting">Waiting</option>
                <option value="ready">Ready</option>
                <option value="started">Started</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Teams Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredTeams.length === 0 ? (
            <div className="text-center py-12">
              <FaUserFriends className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No teams found
              </h3>
              <p className="text-gray-500">
                {teams.length === 0
                  ? "No teams have been created yet."
                  : "No teams match your search criteria."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Members
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeams.map((team) => (
                    <tr
                      key={team._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                              {team.name?.charAt(0)?.toUpperCase() || "T"}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {team.name || "Unnamed Team"}
                              </div>
                              <div className="text-sm text-gray-500">
                                Code: {team.code || "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {team.members?.slice(0, 3).map((member, index) => (
                              <div
                                key={member.userId || index}
                                className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700"
                                title={member.userName || "Unknown User"}
                              >
                                {member.userImage ? (
                                  <img
                                    src={member.userImage}
                                    alt={member.userName || "User"}
                                    className="w-full h-full rounded-full"
                                  />
                                ) : (
                                  (
                                    member.userName?.charAt(0) || "U"
                                  ).toUpperCase()
                                )}
                              </div>
                            ))}
                            {team.members && team.members.length > 3 && (
                              <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                +{team.members.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {team.members?.length || 0} member
                            {(team.members?.length || 0) !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(team.status)}`}
                        >
                          {getStatusIcon(team.status)}
                          {safeUpperCase(team.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(team.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedTeam(team);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>

                          {/* Status Update Buttons */}
                          {team.status !== "completed" && (
                            <button
                              onClick={() =>
                                handleUpdateTeamStatus(team._id, "completed")
                              }
                              disabled={actionLoading === team._id}
                              className="text-green-600 hover:text-green-900 p-1 rounded transition-colors disabled:opacity-50"
                              title="Mark as Completed"
                            >
                              <FaRegCheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedTeam(team);
                              setShowDeleteModal(true);
                            }}
                            disabled={actionLoading === team._id}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors disabled:opacity-50"
                            title="Delete Team"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Team Details Modal */}
        {showDetailsModal && selectedTeam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Team Details
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Team Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Team Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        Team Name
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedTeam.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        Team Code
                      </label>
                      <p className="text-sm text-gray-900 font-mono">
                        {selectedTeam.code || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedTeam.status)}`}
                      >
                        {getStatusIcon(selectedTeam.status)}
                        {safeUpperCase(selectedTeam.status)}
                      </span>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        Created
                      </label>
                      <p className="text-sm text-gray-900">
                        {formatDate(selectedTeam.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Members List */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">
                    Team Members
                  </h4>
                  <div className="space-y-2">
                    {selectedTeam.members?.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
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
                            <div className="text-sm font-medium text-gray-900">
                              {member.userName || "Unknown User"}
                              {member.role === "leader" && (
                                <FaCrown className="inline w-3 h-3 text-yellow-500 ml-1" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Joined: {formatDate(member.joinedAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              member.ready
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {member.ready ? "Ready" : "Not Ready"}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              member.role === "leader"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {member.role === "leader" ? (
                              <FaCrown className="w-3 h-3" />
                            ) : (
                              <FaUser className="w-3 h-3" />
                            )}
                            {safeUpperCase(member.role)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedTeam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FiTrash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Team
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the team{" "}
                  <strong>"{selectedTeam.name}"</strong>? This action cannot be
                  undone and all team data will be permanently removed.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={actionLoading === selectedTeam._id}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(selectedTeam._id)}
                    disabled={actionLoading === selectedTeam._id}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading === selectedTeam._id
                      ? "Deleting..."
                      : "Delete Team"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
