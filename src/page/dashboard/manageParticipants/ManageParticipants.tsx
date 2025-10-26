import { useState, useEffect } from "react";
import {
  FiSearch,
  FiTrash2,
  FiRefreshCw,
  FiEye,
  FiUsers,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  FaUserFriends,
  FaRegCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import useAxiosSecure from "../../../hook/useAxiosSecure";

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
  const [typeFilter, setTypeFilter] = useState<"all" | "individual" | "team">(
    "all"
  );
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
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
      const participantsData =
        participantsRes.data.participants || participantsRes.data;
      setParticipants(Array.isArray(participantsData) ? participantsData : []);

      // Try to fetch contests, but handle if the endpoint doesn't exist
      let contestsData: Contest[] = [];
      try {
        const contestsRes = await axiosSecure.get("/api/contests"); // Use your actual contests endpoint
        contestsData = Array.isArray(contestsRes.data) ? contestsRes.data : [];
      } catch (contestError) {
        console.log(
          "Contests endpoint not available, extracting from participants",
          contestError
        );
        // Extract unique contests from participants data
        const uniqueContestIds = Array.from(
          new Set(participantsData.map((p: Participant) => p.contestId))
        ) as string[];

        contestsData = uniqueContestIds.map((contestId: string) => ({
          _id: contestId,
          name: `Contest ${contestId.slice(-6)}`, // Fallback name
          createdAt: new Date().toISOString(),
        }));
      }
      setContests(contestsData);

      // Try to fetch stats, but handle if the endpoint doesn't exist
      try {
        const statsRes = await axiosSecure.get(
          "/api/contestParticipants/stats"
        );
        setStats(statsRes.data);
      } catch (statsError) {
        console.log("Stats endpoint not available, calculating manually", statsError);
        // Calculate basic stats manually
        const totalParticipants = participantsData.length;
        const participantsByType = [
          {
            _id: "individual",
            count: participantsData.filter(
              (p: Participant) => p.type === "individual"
            ).length,
          },
          {
            _id: "team",
            count: participantsData.filter(
              (p: Participant) => p.type === "team"
            ).length,
          },
        ];

        // Calculate duplicates manually
        const duplicateMap = new Map();
        participantsData.forEach((participant: Participant) => {
          const key = `${participant.userId}-${participant.contestId}`;
          duplicateMap.set(key, (duplicateMap.get(key) || 0) + 1);
        });

        const duplicates = Array.from(duplicateMap.values()).filter(
          (count) => count > 1
        ).length;

        setStats({
          totalParticipants: [{ count: totalParticipants }],
          participantsByType,
          participantsByContest: [],
          duplicates: [{ count: duplicates }],
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
        duplicates: [{ count: 0 }],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter participants
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (participant.userEmail &&
        participant.userEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      participant.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.contestName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesContest =
      contestFilter === "all" || participant.contestId === contestFilter;
    const matchesType = typeFilter === "all" || participant.type === typeFilter;

    return matchesSearch && matchesContest && matchesType;
  });

  const handleDeleteParticipant = async (participantId: string) => {
    try {
      setActionLoading(participantId);
      await axiosSecure.delete(`/api/contestParticipants/${participantId}`);
      setParticipants(participants.filter((p) => p._id !== participantId));
      setShowDeleteModal(false);
      setSelectedParticipant(null);
      await fetchData(); // Refresh stats
    } catch (error) {
      console.error("Error deleting participant:", error);
      alert("Error deleting participant");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCleanupDuplicates = async () => {
    try {
      setActionLoading("cleanup");
      // Try the duplicates endpoint, fallback to manual cleanup
      try {
        const response = await axiosSecure.delete(
          "/api/contestParticipants/duplicates"
        );
        alert(`Success: ${response.data.message}`);
      } catch (duplicateError) {
        // Manual duplicate cleanup
        const uniqueParticipants = participants.filter(
          (participant, index, self) =>
            index ===
            self.findIndex(
              (p) =>
                p.userId === participant.userId &&
                p.contestId === participant.contestId
            )
        );
        setParticipants(uniqueParticipants);
        alert("Duplicates cleaned up manually");
      }
      setShowCleanupModal(false);
      await fetchData(); // Refresh all data
    } catch (error) {
      console.error("Error cleaning up duplicates:", error);
      alert("Error cleaning up duplicates");
    } finally {
      setActionLoading(null);
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
      participants.forEach((participant) => {
        const key = `${participant.userId}-${participant.contestId}`;
        duplicateMap.set(key, (duplicateMap.get(key) || 0) + 1);
      });
      return Array.from(duplicateMap.values()).filter((count) => count > 1)
        .length;
    }
    return stats.duplicates[0].count;
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
                Manage Participants
              </h1>
              <p className="text-gray-600 mt-2">
                Manage contest registrations and resolve duplicate entries
              </p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Participants
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {participants.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Individual</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {participants.filter((p) => p.type === "individual").length}
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
                <p className="text-sm font-medium text-gray-600">Team</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {participants.filter((p) => p.type === "team").length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaUserFriends className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Duplicates</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {getDuplicateCount()}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FaExclamationTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            {getDuplicateCount() > 0 && (
              <button
                onClick={() => setShowCleanupModal(true)}
                className="w-full mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Clean Up
              </button>
            )}
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
                  placeholder="Search by name, email, user ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={contestFilter}
                onChange={(e) => setContestFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Contests</option>
                {contests.map((contest) => (
                  <option key={contest._id} value={contest._id}>
                    {contest.name}
                  </option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="team">Team</option>
              </select>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredParticipants.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No participants found
              </h3>
              <p className="text-gray-500">
                {participants.length === 0
                  ? "No participants have registered yet."
                  : "No participants match your search criteria."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParticipants.map((participant) => (
                    <tr
                      key={participant._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {participant.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {participant.userEmail || "No email"}
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            ID: {participant.userId.slice(0, 8)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Contest {participant.contestId.slice(-6)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(participant.joinedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            participant.type === "individual"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {participant.type.charAt(0).toUpperCase() +
                            participant.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(participant.joinedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedParticipant(participant);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedParticipant(participant);
                              setShowDeleteModal(true);
                            }}
                            disabled={actionLoading === participant._id}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors disabled:opacity-50"
                            title="Remove Participant"
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

        {/* Rest of the modals remain the same */}
        {/* Participant Details Modal */}
        {showDetailsModal && selectedParticipant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Participant Details
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedParticipant.userName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedParticipant.userEmail || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    User ID
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {selectedParticipant.userId}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Contest ID
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {selectedParticipant.contestId}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Type
                  </label>
                  <p className="text-sm text-gray-900 capitalize">
                    {selectedParticipant.type}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Joined At
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedParticipant.joinedAt)}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex justify-end">
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
        {showDeleteModal && selectedParticipant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FiTrash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Remove Participant
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to remove{" "}
                  <strong>{selectedParticipant.userName}</strong> from the
                  contest? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={actionLoading === selectedParticipant._id}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteParticipant(selectedParticipant._id)
                    }
                    disabled={actionLoading === selectedParticipant._id}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading === selectedParticipant._id
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cleanup Duplicates Modal */}
        {showCleanupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Clean Up Duplicates
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  This will remove all duplicate contest registrations (same
                  user in same contest). Only the earliest registration will be
                  kept. This action affects{" "}
                  <strong>{getDuplicateCount()} entries</strong> and cannot be
                  undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowCleanupModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={actionLoading === "cleanup"}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCleanupDuplicates}
                    disabled={actionLoading === "cleanup"}
                    className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading === "cleanup"
                      ? "Cleaning..."
                      : "Clean Up Duplicates"}
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
