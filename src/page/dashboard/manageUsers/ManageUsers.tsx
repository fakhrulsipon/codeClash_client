import React, { useState } from "react";
import {
  useQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";
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

  const handleRoleChange = (id: string, role: "user" | "admin") => {
    updateRoleMutation.mutate({ id, role });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* 🔹 Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search user by name..."
          className="w-full sm:w-1/2 border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* 🔹 User List */}
      {users.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
              <thead>
                <tr className="bg-blue-50 text-left">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="py-3 px-4">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {user.userName}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {user.userEmail}
                    </td>
                    <td className="py-3 px-4 font-semibold capitalize">
                      {user.userRole}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {user.userRole === "admin" ? (
                        <button
                          onClick={() => handleRoleChange(user._id, "user")}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                          Remove Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user._id, "admin")}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        >
                          Make Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {user.userName}
                  </h3>
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {user.userRole}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{user.userEmail}</p>
                <div className="text-right">
                  {user.userRole === "admin" ? (
                    <button
                      onClick={() => handleRoleChange(user._id, "user")}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Remove Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRoleChange(user._id, "admin")}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                      Make Admin
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-gray-600 text-lg">
          No users found
        </div>
      )}

      {/* 🔹 Pagination Section */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-600 transition-all"
          >
            Prev
          </button>

          {/* Page numbers */}
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-full font-semibold ${
                  p === page
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                } transition-all`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-600 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
