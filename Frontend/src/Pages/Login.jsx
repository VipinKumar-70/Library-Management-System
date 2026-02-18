import { useState } from "react";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form); // later API call
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center px-4">
      <div className="grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full">
        {/* LEFT HERO */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-indigo-600 text-white">
          <h2 className="text-5xl font-bold mb-3">Welcome Back</h2>
          <p className="text-indigo-100 font-medium">
            Login to manage your library account.
          </p>

          <ul className="mt-6 space-y-2 text-xl  font-medium">
            <li>📚 View borrowed books</li>
            <li>⏰ Track due dates</li>
            <li>💳 Fine status</li>
            <li>📩 Notifications</li>
          </ul>
        </div>

        {/* FORM */}
        <div className="p-8 md:p-10">
          <h3 className="text-2xl font-bold mb-1 text-gray-800">
            Login to SmartLibrary
          </h3>

          <p className="text-gray-500 mb-6 text-sm">Enter your credentials</p>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition">
              Login
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Forgot password? Contact library admin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
