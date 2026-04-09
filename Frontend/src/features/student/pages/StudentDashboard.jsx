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
    <div className="bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar
        open={open}
        active={active}
        setActive={setActive}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Topbar user={user} active={active} setOpen={setOpen} />

        <main className="flex-1 p-6 overflow-y-auto">
          {active === "dashboard" && <DashboardSection />}
          {active === "books" && <BooksSection />}
          {active === "profile" && <ProfileSection user={user} />}
        </main>
      </div>
    </div>
  );
};
export default StudentDashboard;
