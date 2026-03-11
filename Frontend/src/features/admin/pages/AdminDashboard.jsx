import React from "react";
import { useAdminAuth } from "../../../context/adminAuthContext";
import { logoutAdmin } from "../../../api";
import { useNavigate } from "react-router";

const DashboardCard = ({ title, value, trend, trendPositive }) => (
  <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <div className="text-3xl font-bold">{value}</div>
      <div
        className={`text-sm font-semibold ${
          trendPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {trendPositive ? "↑" : "↓"} {trend}
      </div>
    </div>
    <div className="mt-2 text-gray-500 font-medium">{title}</div>
  </div>
);

const AdminDashboard = () => {
  const { admin, loading, setAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setAdmin(null);
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!admin)
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Not authorized or admin not found.
      </div>
    );

  // Dummy data - replace with real API data as needed
  const totalBooks = 0;
  const totalStudents = 2;
  const booksBorrowed = 0;
  const activeRequests = 0;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-indigo-600">
          SmartLibrary
        </div>

        <nav className="flex-1 p-6 space-y-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="block w-full text-left py-2 px-3 rounded hover:bg-indigo-600 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/admin/manage-books")}
            className="block w-full text-left py-2 px-3 rounded hover:bg-indigo-600 transition"
          >
            Manage Books
          </button>
          <button
            onClick={() => navigate("/admin/bulk-upload")}
            className="block w-full text-left py-2 px-3 rounded hover:bg-indigo-600 transition"
          >
            Bulk Upload
          </button>
          <button
            onClick={() => navigate("/admin/borrow-requests")}
            className="block w-full text-left py-2 px-3 rounded hover:bg-indigo-600 transition"
          >
            Borrow Requests
          </button>
          <button
            onClick={() => navigate("/admin/students")}
            className="block w-full text-left py-2 px-3 rounded hover:bg-indigo-600 transition"
          >
            Students
          </button>
          <button
            onClick={() => navigate("/admin/analytics")}
            className="block w-full text-left py-2 px-3 rounded hover:bg-indigo-600 transition"
          >
            Analytics
          </button>
          <button
            onClick={() => navigate("/admin/settings")}
            className="block w-full text-left py-2 px-3 rounded hover:bg-indigo-600 transition"
          >
            Settings
          </button>
        </nav>

        <div className="p-6 border-t border-indigo-600">
          <div className="mb-2 font-semibold">{admin.email}</div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 rounded py-2 text-white font-semibold transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-700 mb-8">
          Welcome back, {admin.email}! Here's what's happening today.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <DashboardCard
            title="Total Books"
            value={totalBooks}
            trend="12%"
            trendPositive={true}
          />
          <DashboardCard
            title="Total Students"
            value={totalStudents}
            trend="5%"
            trendPositive={true}
          />
          <DashboardCard
            title="Books Borrowed"
            value={booksBorrowed}
            trend="18%"
            trendPositive={true}
          />
          <DashboardCard
            title="Active Requests"
            value={activeRequests}
            trend="2%"
            trendPositive={false}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Borrow Activity</h2>
            <div className="h-48 flex items-center justify-center text-gray-400 italic">
              Chart Placeholder
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Category Distribution
            </h2>
            <div className="h-48 flex items-center justify-center text-gray-400 italic">
              Pie Chart Placeholder
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
