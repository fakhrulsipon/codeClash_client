import React, { useState } from "react";
import {
  useQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { motion } from "framer-motion";
import { FiSearch, FiUser, FiMail, FiShield, FiUserCheck, FiUserX } from "react-icons/fi";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hook/useAxiosPublic";

interface User {
  _id: string;
  userName: string;
  userEmail: string;
  userRole: "user" | "admin";
  createdAt: string;
}

interface UsersResponse {
  users: User[];
  total: number;
}

const ManageUsers: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const axiosPublic = useAxiosPublic();

  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["users", search, page],
    queryFn: async (): Promise<UsersResponse> => {
      const res = await axiosPublic.get(
        `/api/users?search=${search}&page=${page}&limit=${limit}`
      );
      return res.data as UsersResponse;
    },
    placeholderData: (previousData) => previousData,
  });

  const users: User[] = data?.users ?? [];
  const totalUsers: number = data?.total ?? 0;
  const totalPages = Math.ceil(totalUsers / limit);

  const updateRoleMutation = useMutation({
    mutationFn: async ({
      id,
      role,
    }: {
      id: string;
      role: "user" | "admin";
    }) => {
      const res = await axiosSecure.patch(`/api/users/${id}/role`, { role });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleRoleChange = async (id: string, role: "user" | "admin", userName: string) => {
    const action = role === "admin" ? "make admin" : "remove admin";
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${action} for ${userName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: role === "admin" ? '#10b981' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}`,
      background: '#1e293b',
      color: 'white'
    });

    if (result.isConfirmed) {
      updateRoleMutation.mutate({ id, role });
      Swal.fire({
        title: 'Success!',
        text: `${userName} has been ${action === "make admin" ? "made admin" : "removed from admin"}`,
        icon: 'success',
        confirmButtonColor: '#06b6d4',
        background: '#1e293b',
        color: 'white'
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-6"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Manage Users
          </h2>
          <p className="text-gray-400">Manage user roles and permissions</p>
        </div>

        <div className="relative w-full lg:w-96">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search user by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Stats Cards - Optimized for Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Users</p>
              <p className="text-2xl lg:text-3xl font-bold text-white mt-1">{totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <FiUser className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Admins</p>
              <p className="text-2xl lg:text-3xl font-bold text-purple-400 mt-1">
                {users.filter(user => user.userRole === "admin").length}
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <FiShield className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Regular Users</p>
              <p className="text-2xl lg:text-3xl font-bold text-cyan-400 mt-1">
                {users.filter(user => user.userRole === "user").length}
              </p>
            </div>
            <div className="p-3 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
              <FiUser className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table - Optimized Layout */}
      <div className="hidden xl:block bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50 border-b border-white/10">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold text-cyan-300 uppercase tracking-wider w-16">#</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-cyan-300 uppercase tracking-wider">User</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-cyan-300 uppercase tracking-wider">Email</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-cyan-300 uppercase tracking-wider w-32">Role</th>
              <th className="px-4 py-4 text-center text-sm font-semibold text-cyan-300 uppercase tracking-wider w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user, index) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-700/30 transition-colors duration-200"
              >
                <td className="px-4 py-4 text-gray-300 text-sm">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-white text-sm">{user.userName}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <FiMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{user.userEmail}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    user.userRole === "admin" 
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/30" 
                      : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                  }`}>
                    {user.userRole === "admin" ? <FiShield className="w-3 h-3 mr-1" /> : <FiUser className="w-3 h-3 mr-1" />}
                    {user.userRole}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {user.userRole === "admin" ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRoleChange(user._id, "user", user.userName)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200 border border-red-500/30 text-sm"
                      >
                        <FiUserX className="w-4 h-4" />
                        Remove Admin
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRoleChange(user._id, "admin", user.userName)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all duration-200 border border-green-500/30 text-sm"
                      >
                        <FiUserCheck className="w-4 h-4" />
                        Make Admin
                      </motion.button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet View (lg screens) */}
      <div className="hidden lg:block xl:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 border border-white/10 rounded-xl p-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      <FiUser className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base">{user.userName}</h3>
                      <p className="text-gray-400 text-sm flex items-center gap-1">
                        <FiMail className="w-3 h-3" />
                        {user.userEmail}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    user.userRole === "admin" 
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/30" 
                      : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                  }`}>
                    {user.userRole}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-400">
                    <span className="block text-xs">Serial</span>
                    <span className="text-white">
                      #{(page - 1) * limit + index + 1}
                    </span>
                  </div>
                  <div className="text-gray-400">
                    <span className="block text-xs">Joined</span>
                    <span className="text-white text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  {user.userRole === "admin" ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRoleChange(user._id, "user", user.userName)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200 border border-red-500/30 text-sm"
                    >
                      <FiUserX className="w-4 h-4" />
                      Remove Admin
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRoleChange(user._id, "admin", user.userName)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all duration-200 border border-green-500/30 text-sm"
                    >
                      <FiUserCheck className="w-4 h-4" />
                      Make Admin
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {users.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base">{user.userName}</h3>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <FiMail className="w-3 h-3" />
                      {user.userEmail}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  user.userRole === "admin" 
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/30" 
                    : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                }`}>
                  {user.userRole}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-gray-400">
                  <span className="block text-xs">Serial</span>
                  <span className="text-white">
                    #{(page - 1) * limit + index + 1}
                  </span>
                </div>
                <div className="text-gray-400">
                  <span className="block text-xs">Joined</span>
                  <span className="text-white text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                {user.userRole === "admin" ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRoleChange(user._id, "user", user.userName)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200 border border-red-500/30 text-sm"
                  >
                    <FiUserX className="w-4 h-4" />
                    Remove Admin
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRoleChange(user._id, "admin", user.userName)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all duration-200 border border-green-500/30 text-sm"
                  >
                    <FiUserCheck className="w-4 h-4" />
                    Make Admin
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <FiUser className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </motion.div>
      )}

      {/* Pagination Section - Optimized for Desktop */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8"
        >
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 disabled:bg-slate-800/30 disabled:text-gray-600 transition-all duration-200 border border-white/10 disabled:border-white/5 text-sm"
            >
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg font-semibold transition-all duration-200 text-sm ${
                      pageNum === page
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                        : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 border border-white/10"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 7 && page < totalPages - 3 && (
                <>
                  <span className="text-gray-400 mx-1">...</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className="w-8 h-8 bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 rounded-lg border border-white/10 text-sm"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 disabled:bg-slate-800/30 disabled:text-gray-600 transition-all duration-200 border border-white/10 disabled:border-white/5 text-sm"
            >
              Next
            </button>
          </div>

          <div className="text-gray-400 text-sm">
            Page {page} of {totalPages}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageUsers;