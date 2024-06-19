import React, { ReactNode } from 'react';
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRouteStaff: React.FC<ProtectedRouteProps> = ({ children }) => {
  const staff: any = useSelector((state: any) => state.staff);
  console.log("staff ",staff)
  let location = useLocation();

  if (!staff?.isAuthenticated) {
    return <Navigate to="/staff/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRouteStaff;
