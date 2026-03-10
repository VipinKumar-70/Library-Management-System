import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center px-4">
      <div className="grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full">
        {/* LEFT HERO */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-indigo-700 text-white">
          <h2 className="text-5xl font-bold mb-3">Admin Portal</h2>
          <p className="text-gray-300 font-medium">
            Manage the entire library system.
          </p>

          <ul className="mt-6 space-y-2 text-xl font-medium">
            <li>📚 Manage Books</li>
            <li>👨‍🎓 Manage Students</li>
            <li>📊 Library Reports</li>
            <li>💰 Fine Management</li>
          </ul>
        </div>

        {/* FORM */}
        <div className="p-8 md:p-10">
          <h3 className="text-2xl font-bold mb-1 text-gray-800">Admin Login</h3>

          <p className="text-gray-500 mb-6 text-sm">
            Login to access admin dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Admin Email"
              className="input"
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="input"
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-medium transition"
            >
              Login as Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
