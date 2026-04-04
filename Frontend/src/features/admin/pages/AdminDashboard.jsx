import React, { useEffect, useState } from "react";
import ManageBooks from "../components/ManageBooks ";
import AdminStudents from "../components/AdminStudents";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { logoutAdmin } from "../../../api/admin/authAdmin";
import { useNavigate } from "react-router";
import { getAllStudents, fetchBooksApi } from "../../../api/index";
import BookRequest from "../components/BookRequest";
import {
  getAdminStatsApi,
  getAllBorrowsApi,
  approveBorrowApi,
} from "../../../api/book/borrowApi";

import BulkUpload from "../components/BulkUpload";

const DashboardCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="text-3xl font-bold">{value}</div>
    <div className="mt-2 text-gray-500">{title}</div>
  </div>
);

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    totalRequests: 0,
  });
  const [borrows, setBorrows] = useState([]);

  const { admin, loading, setAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("dashboard");

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

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">SmartLibrary</div>

        <nav className="flex-1 p-6 space-y-3">
          {[
            { name: "Dashboard", key: "dashboard" },
            { name: "Manage Books", key: "books" },
            { name: "Students", key: "students" },
            { name: "Analyze", key: "Analyze" },
            { name: "Requests", key: "requests" },
            { name: "Bulk Upload", key: "Bulk Upload" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveView(item.key)}
              className={`block w-full text-left py-2 px-3 rounded ${
                activeView === item.key
                  ? "bg-indigo-800"
                  : "hover:bg-indigo-600"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t">
          <p>{admin.email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 bg-red-500 w-full py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {/* DASHBOARD */}
        {activeView === "dashboard" && (
          <>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-4 gap-4">
              <DashboardCard title="Total Books" value={books.length} />
              <DashboardCard title="Total Students" value={students.length} />
              <DashboardCard title="Borrowed" value={stats.totalBorrowed} />
              <DashboardCard title="Requests" value={stats.totalRequests} />
            </div>
          </>
        )}

        {activeView === "books" && <ManageBooks />}
        {activeView === "students" && <AdminStudents />}
        {activeView === "Bulk Upload" && <BulkUpload />}
        {activeView === "requests" && (
          <BookRequest borrows={borrows} onApprove={handleApprove} />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
