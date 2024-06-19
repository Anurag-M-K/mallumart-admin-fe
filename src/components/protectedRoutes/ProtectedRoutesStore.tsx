import React, { ReactNode } from 'react';
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRouteStore: React.FC<ProtectedRouteProps> = ({ children }) => {
  const store: any = useSelector((state: any) => state.storeOwner);
  console.log("store ",store)
  let location = useLocation();

  if (!store?.isAuthenticated) {
    return <Navigate to="/store/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRouteStore;
