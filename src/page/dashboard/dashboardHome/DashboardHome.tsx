// src/page/dashboard/dashboardHome/DashboardHome.tsx
import React from "react";
import { useOutletContext } from "react-router";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useUserRole from "../../../hook/useUserRole";
import AdminDashboardHome from "./AdminDashboardHome";
import UserDashboardHome from "./UserDashboardHome";

interface DashboardContext {
  user: any;
}

const DashboardHome: React.FC = () => {
  const { user } = useOutletContext<DashboardContext>();
  const email = user?.email || user?.providerData?.[0]?.email;
  const { userRole, roleLoading } = useUserRole(email);

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // Render AdminDashboardHome for admin users, UserDashboardHome for regular users
  return userRole === "admin" ? <AdminDashboardHome /> : <UserDashboardHome />;
};

export default DashboardHome;
