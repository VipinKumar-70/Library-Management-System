import { useState } from "react";
import { registerUser, loginUser } from "../api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    course: "",
    enrollment: "",
    school: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await registerUser(form);

    console.log(response); // later yahin API call hogi
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center px-4">
      <div className="grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full">
        {/* LEFT HERO */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-indigo-600 text-white">
          <h2 className="text-5xl font-bold mb-3">Welcome to SmartLibrary</h2>
          <p className="text-indigo-100 font-medium">
            Register once and access books, issue records, fines & more.
          </p>

          <ul className="mt-6 space-y-2 text-xl font-medium">
            <li>📚 Digital Library Access</li>
            <li>🧾 Borrow History</li>
            <li>⏰ Fine Tracking</li>
            <li>📩 Email Verification</li>
          </ul>
        </div>

        {/* FORM */}
        <div className="p-8 md:p-10">
          <h3 className="text-2xl font-bold mb-1 text-gray-800">
            Student Registration
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            Create your library account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              className="input"
              onChange={handleChange}
              required
            />

            <input
              name="course"
              placeholder="Course"
              className="input"
              onChange={handleChange}
              required
            />

            <input
              name="enrollment"
              placeholder="Enrollment Number"
              className="input"
              onChange={handleChange}
              required
            />

            <select
              name="school"
              className="input"
              onChange={handleChange}
              required
            >
              <option value="">Select School</option>
              <option value="SOET">SOET</option>
              <option value="SSGT">SSGT</option>
            </select>

            <input
              name="email"
              type="email"
              placeholder="Email Address"
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
            >
              Create Account
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By registering, you agree to library terms & policies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
