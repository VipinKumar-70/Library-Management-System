import { useState } from "react";
import { updateStudent } from "../../../api/index";

const EditStudentModal = ({ student, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    username: student.username || "",
    email: student.email || "",
    course: student.course || "",
    enrollment: student.enrollment || "",
    school: student.school || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateStudent(student._id, form);

    onSuccess(); // refresh list
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Edit Student</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border p-2 rounded"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />

          <input
            name="course"
            value={form.course}
            onChange={handleChange}
            placeholder="Course"
            className="w-full border p-2 rounded"
          />

          <input
            name="enrollment"
            value={form.enrollment}
            onChange={handleChange}
            placeholder="Enrollment"
            className="w-full border p-2 rounded"
          />

          <input
            name="school"
            value={form.school}
            onChange={handleChange}
            placeholder="School"
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
