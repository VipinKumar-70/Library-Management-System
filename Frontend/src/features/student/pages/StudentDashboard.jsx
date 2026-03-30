import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../api";
import { useAuth } from "../../../context/AuthContext";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import DashboardSection from "../components/DashboardSection";
import BooksSection from "../components/BooksSection";


import ProfileSection from "../components/ProfileSection";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, loading, setUser } = useAuth();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("dashboard");

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    navigate("/login");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        open={open}
        setOpen={setOpen}
        active={active}
        setActive={setActive}
        handleLogout={handleLogout}
      />

      <div className="flex-1">
        <Topbar user={user} active={active} setOpen={setOpen} />

        <main className="p-6">
          {active === "dashboard" && <DashboardSection />}
          {active === "books" && <BooksSection />}
          

          {active === "profile" && <ProfileSection user={user} />}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
