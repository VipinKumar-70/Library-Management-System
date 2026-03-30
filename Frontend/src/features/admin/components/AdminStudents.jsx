import { useEffect, useState } from "react";
import {
  getAllStudents,
  deleteStudent,
  updateStudent,
} from "../../../api/index";

import { approveBorrowApi } from "../../../api/book/borrowApi";
import EditStudentModal from "./EditStudentModal";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const data = await getAllStudents();
    setStudents(data.students || []);
    setFiltered(data.students || []);
  };

  // 🔍 Search
  useEffect(() => {
    const result = students.filter((s) =>
      (s.username || "").toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(result);
  }, [search, students]);

  // 🗑 Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this student?")) return;
    await deleteStudent(id);
    fetchStudents();
  };

  // ✅ Approve Request
  const handleApprove = async (borrowId) => {
    await approveBorrowApi(borrowId);
    fetchStudents();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Students</h1>

        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Email</th>
              <th className="p-4">Course</th>
              <th className="p-4">Borrowed</th>
              <th className="p-4">Pending</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <>
                <tr key={s._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center">
                      {s.username?.charAt(0)}
                    </div>
                    {s.username}
                  </td>

                  <td className="p-4">{s.email}</td>
                  <td className="p-4">{s.course}</td>

                  {/* 🔥 Real Data */}
                  <td className="p-4 text-blue-600">{s.borrowCount}</td>
                  <td className="p-4 text-yellow-600">{s.pendingCount}</td>

                  <td className="p-4">
                    {s.isBlocked ? (
                      <span className="text-red-500">Blocked</span>
                    ) : (
                      <span className="text-green-500">Active</span>
                    )}
                  </td>

                  <td className="p-4 space-x-2">
                    <button
                      onClick={() =>
                        setExpandedRow(expandedRow === s._id ? null : s._id)
                      }
                      className="text-indigo-600"
                    >
                      View
                    </button>

                    <button
                      onClick={() => setSelectedStudent(s)}
                      className="text-yellow-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {/* 🔥 EXPANDED ROW (REQUESTS) */}
                {expandedRow === s._id && (
                  <tr className="bg-gray-50">
                    <td colSpan="7" className="p-4">
                      <h3 className="font-semibold mb-2">Requests</h3>

                      {s.borrows.length === 0 ? (
                        <p className="text-gray-400">No requests</p>
                      ) : (
                        s.borrows.map((b) => (
                          <div
                            key={b._id}
                            className="flex justify-between items-center border-b py-2"
                          >
                            <span>{b.book.title}</span>

                            <div className="flex items-center gap-3">
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  b.status === "pending"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : b.status === "approved"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-gray-200"
                                }`}
                              >
                                {b.status}
                              </span>

                              {b.status === "pending" && (
                                <button
                                  onClick={() => handleApprove(b._id)}
                                  className="bg-indigo-600 text-white px-2 py-1 rounded text-xs"
                                >
                                  Approve
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="p-6 text-center text-gray-400">No students found</p>
        )}
      </div>

      {/* Modal */}
      {selectedStudent && (
        <EditStudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSuccess={fetchStudents}
        />
      )}
    </div>
  );
};

export default AdminStudents;
