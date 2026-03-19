import React from "react";
import { useContext, createContext, useEffect, useState } from "react";
import { adminProfile } from "../api/admin/adminApi";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async () => {
    try {
      const data = await adminProfile();
      setAdmin(data);
    } catch (error) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin, loading, checkAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
