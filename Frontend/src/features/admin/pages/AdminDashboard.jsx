import React, { useEffect, useState } from "react";
import ManageBooks from "../components/ManageBooks";
import AdminStudents from "../components/AdminStudents";
import BookRequest from "../components/BookRequest";
import BulkUpload from "../components/BulkUpload";
import AnalyticsSection from "../components/AnalyticsSection";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { useNavigate } from "react-router";
import {
  logoutAdmin,
  getAllStudents,
  fetchBooksApi,
  getAdminStatsApi,
  getAllBorrowsApi,
  approveBorrowApi,
} from "../../../api";

// ── Unchanged DashboardCard ───────────────────────────────────────
const DashboardCard = ({ title, value, delta, deltaColor }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <div className="text-3xl font-bold">{value}</div>
    <div className="mt-2 text-gray-500">{title}</div>
    {delta && (
      <div className="mt-1.5 text-xs" style={{ color: deltaColor }}>
        {delta}
      </div>
    )}
  </div>
);

// ── Main component ────────────────────────────────────────────────
const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ totalBorrowed: 0, totalRequests: 0 });
  const [borrows, setBorrows] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");

  const { admin, loading, setAdmin } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentRes, bookRes, statsRes, borrowRes] = await Promise.all([
        getAllStudents(),
        fetchBooksApi(),
        getAdminStatsApi(),
        getAllBorrowsApi(),
      ]);
      setStudents(studentRes.students);
      setBooks(bookRes.books);
      setStats(statsRes);
      setBorrows(borrowRes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    await approveBorrowApi(id);
    fetchData();
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setAdmin(null);
    navigate("/admin/login");
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!admin) return <div className="p-8 text-center">Unauthorized</div>;

  const pendingBorrows = borrows.filter((b) => b.status === "pending");
  const overdueCount = borrows.filter((b) => b.status === "overdue").length;

  const categoryTotals = borrows.reduce((acc, b) => {
    const cat = b.book?.category || "Unknown";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const maxCatCount = topCategories[0]?.[1] || 1;

  const catColors = ["#4338ca", "#16a34a", "#d97706", "#dc2626", "#0891b2"];

  const statusColor = (status) => {
    if (status === "returned") return "#16a34a";
    if (status === "overdue") return "#dc2626";
    return "#4338ca";
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "books", label: "Manage Books" },
    { key: "students", label: "Students" },
    { key: "analytics", label: "Analytics" },
    { key: "requests", label: "Requests" },
    { key: "bulk", label: "Bulk Upload" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ── Sidebar — original untouched ── */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">SmartLibrary</div>

        <nav className="flex-1 p-6 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveView(item.key)}
              className={`block w-full text-left py-2 px-3 rounded transition ${
                activeView === item.key
                  ? "bg-indigo-800"
                  : "hover:bg-indigo-600"
              }`}
            >
              {item.name || item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-indigo-600">
          <p>{admin.email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 bg-red-500 w-full py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* ── Dashboard view ── */}
        {activeView === "dashboard" && (
          <>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Original 4-card grid */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <DashboardCard
                title="Total Books"
                value={books.length}
                delta="+12 this month"
                deltaColor="#166534"
              />
              <DashboardCard
                title="Total Students"
                value={students.length}
                delta="+5 this week"
                deltaColor="#166534"
              />
              <DashboardCard
                title="Borrowed"
                value={stats.totalBorrowed}
                delta={
                  overdueCount > 0 ? `${overdueCount} overdue` : "All on time"
                }
                deltaColor={overdueCount > 0 ? "#b45309" : "#166534"}
              />
              <DashboardCard
                title="Requests"
                value={stats.totalRequests}
                delta={
                  pendingBorrows.length > 0
                    ? `${pendingBorrows.length} pending`
                    : "All clear"
                }
                deltaColor={pendingBorrows.length > 0 ? "#991b1b" : "#166534"}
              />
            </div>

            {/* Recent activity + Pending approvals */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Recent activity */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900">
                    Recent activity
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                    Today
                  </span>
                </div>

                {borrows.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center">
                    No activity yet
                  </p>
                ) : (
                  borrows.slice(0, 6).map((b, i) => (
                    <div
                      key={i}
                      className="flex gap-3 py-2 border-b border-gray-50 last:border-0"
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: statusColor(b.status) }}
                      />
                      <div>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">
                            {b.user?.username}
                          </span>
                          {b.status === "returned"
                            ? " returned "
                            : " borrowed "}
                          <span className="font-medium">{b.book?.title}</span>
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: statusColor(b.status) }}
                        >
                          {b.status}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pending approvals */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900">
                    Pending approvals
                  </h2>
                  {pendingBorrows.length > 0 && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                      {pendingBorrows.length} new
                    </span>
                  )}
                </div>

                {pendingBorrows.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center">
                    No pending requests
                  </p>
                ) : (
                  pendingBorrows.slice(0, 5).map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-semibold text-violet-700 flex-shrink-0">
                        {b.user?.username?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {b.user?.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {b.book?.title}
                        </p>
                      </div>
                      <button
                        onClick={() => handleApprove(b._id)}
                        className="text-xs px-3 py-1.5 rounded-md bg-green-100 text-green-800 hover:bg-green-200 transition flex-shrink-0"
                      >
                        Approve
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top categories */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Top categories
              </h2>
              {topCategories.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No data yet
                </p>
              ) : (
                topCategories.map(([cat, count], i) => (
                  <div
                    key={cat}
                    className="flex items-center gap-3 mb-3 last:mb-0"
                  >
                    <span className="text-xs text-gray-500 w-20 flex-shrink-0">
                      {cat}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.round((count / maxCatCount) * 100)}%`,
                          background: catColors[i % catColors.length],
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-6 text-right flex-shrink-0">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeView === "books" && <ManageBooks />}
        {activeView === "students" && <AdminStudents />}
        {activeView === "analytics" && <AnalyticsSection />}
        {activeView === "bulk" && <BulkUpload />}
        {activeView === "requests" && (
          <BookRequest borrows={borrows} onApprove={handleApprove} />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
