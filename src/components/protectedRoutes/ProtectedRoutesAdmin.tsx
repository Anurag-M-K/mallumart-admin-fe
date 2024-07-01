import React, { ReactNode } from 'react';
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRouteAdmin: React.FC<ProtectedRouteProps> = ({ children }) => {
  const admin: any = useSelector((state: any) => state.admin);
  let location = useLocation();

  if (!admin?.isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRouteAdmin;
