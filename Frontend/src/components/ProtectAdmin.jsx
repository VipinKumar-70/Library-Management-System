import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const ProtectAdmin = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) return <div>Loading....</div>;

  if (!admin) return <Navigate to="/admin/login" />;

  return children;
};

export default ProtectAdmin;
