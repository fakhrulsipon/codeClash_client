// src/route/AdminRoute.tsx
import { Navigate } from "react-router";
import { use } from "react";
import { AuthContext } from "../provider/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import useUserRole from "../hook/useUserRole";
import type { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = use(AuthContext)!;
  const email = user?.email || user?.providerData?.[0]?.email;
  
  // Always call the hook at the top level
  const { userRole, roleLoading } = useUserRole(email);

  // Show loading when any loading state is true
  if (loading || roleLoading) {
    return <LoadingSpinner />;
  }

  // If no user or no email, redirect to home
  if (!user || !email) {
    return <Navigate to="/" replace />;
  }

  // If userRole is not admin, redirect to dashboard home
  if (userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // If everything is fine, render children
  return <>{children}</>;
};

export default AdminRoute;