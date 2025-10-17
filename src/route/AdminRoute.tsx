import { Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import useUserRole from "../hook/useUserRole";
import type { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useContext(AuthContext)!;
  const email = user?.email ?? undefined;
  const { userRole, roleLoading } = useUserRole(email);

  if (loading || roleLoading) return <LoadingSpinner />;
  if (userRole !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminRoute;
