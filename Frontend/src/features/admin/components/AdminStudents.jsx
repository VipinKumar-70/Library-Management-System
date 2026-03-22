import { useEffect, useState } from "react";
import {
  getAllStudents,
  deleteStudent,
  updateStudent,
} from "../../../api/index";
import EditStudentModal from "./EditStudentModal";

const StudentCard = ({ student }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
          {student.username?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3 className="font-semibold">{student.username}</h3>
          <p className="text-sm text-gray-500">{student.email}</p>
        </div>
      </div>

      <span className="text-sm text-gray-600">{student.course}</span>
    </div>
  );
};

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const data = await getAllStudents();
    setStudents(data.students || []);
    setFiltered(data.students || []);
    setTotal(data.totalStudents || 0);
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

  // 🚫 Block / Unblock
  const handleBlockToggle = async (student) => {
    await updateStudent(student._id, {
      isBlocked: !student.isBlocked,
    });

    fetchStudents();
  };

  // 🟢 Status Badge
  const getStatusBadge = (student) => {
    if (student.isBlocked) {
      return (
        <span className="bg-red-100 text-red-600 px-3 py-1 text-xs rounded-full">
          Blocked
        </span>
      );
    }

    return (
      <span className="bg-green-100 text-green-600 px-3 py-1 text-xs rounded-full">
        Active
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-gray-500">
            Manage and view all registered students
          </p>
        </div>

        <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow">
          Total: {total}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Email</th>
              <th className="p-4">Course</th>
              <th className="p-4">School</th>
              <th className="p-4">Enrollment</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Borrowed</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s._id} className="border-t hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                    {s.username?.charAt(0).toUpperCase()}
                  </div>
                  {s.username}
                </td>

                <td className="p-4">{s.email}</td>
                <td className="p-4">{s.course}</td>
                <td className="p-4">{s.school}</td>
                <td className="p-4">{s.enrollment}</td>

                <td className="p-4 text-sm text-gray-500">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                    {s.borrowedBooks?.length || 0}
                  </span>
                </td>

                <td className="p-4">{getStatusBadge(s)}</td>

                {/* Actions */}
                <td className="p-4 text-center space-x-3">
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

                  <button
                    onClick={() => handleBlockToggle(s)}
                    className="text-purple-500"
                  >
                    {s.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-6 text-center text-gray-500">No students found</div>
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
