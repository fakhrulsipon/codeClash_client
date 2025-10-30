

import { use, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../provider/AuthProvider';

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivetRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = use(AuthContext)!;
  const location = useLocation();

  if (loading) {
    return (
            <div className="flex justify-center items-center h-64">
                <div className="h-10 w-10 animate-[spin_2s_linear_infinite] rounded-full border-4 border-dashed border-sky-600"></div>;
            </div>
        );
  }


  if (!user) {
    return <Navigate to={'/login'} state={location.pathname}></Navigate>
  }
  return children
};

export default PrivetRoute;