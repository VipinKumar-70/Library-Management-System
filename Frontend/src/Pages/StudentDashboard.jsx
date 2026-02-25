import { useState, useEffect } from "react";
import { logoutUser } from "../api";
import { useNavigate } from "react-router";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/profile", {
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 z-40 h-screen w-64 bg-indigo-700 text-white transition-all ${
          open ? "left-0" : "-left-64"
        } md:left-0`}
      >
        <div className="p-6 border-b border-indigo-500">
          <h2 className="text-2xl font-bold">SmartLibrary</h2>
        </div>

        <nav className="p-4 space-y-2 text-base font-medium">
          <Menu label="Dashboard" active={active} setActive={setActive} />
          <Menu label="Books" active={active} setActive={setActive} />
          <Menu label="Borrowed" active={active} setActive={setActive} />
          <Menu label="Fines" active={active} setActive={setActive} />
          <Menu label="Profile" active={active} setActive={setActive} />

          <div className="pt-10">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 rounded hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1">
        {/* TOP BAR */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <button onClick={() => setOpen(!open)} className="md:hidden text-xl">
            ☰
          </button>

          <h3 className="text-lg font-semibold capitalize">{active}</h3>

          <div className="font-medium text-gray-600">{user?.username}</div>
        </header>

        {/* CONTENT */}
        <main className="p-6">
          {active === "dashboard" && <Dashboard />}
          {active === "books" && <Books />}
          {active === "borrowed" && <Borrowed />}
          {active === "fines" && <Fines />}
          {active === "profile" && <Profile user={user} />}
        </main>
      </div>
    </div>
  );
};

const Menu = ({ label, active, setActive }) => (
  <button
    onClick={() => setActive(label.toLowerCase())}
    className={`w-full text-left px-4 py-3 rounded transition ${
      active === label.toLowerCase()
        ? "bg-white text-indigo-700"
        : "hover:bg-indigo-600"
    }`}
  >
    {label}
  </button>
);

/* SECTIONS */

const Dashboard = () => (
  <div className="grid md:grid-cols-3 gap-6">
    <Card title="Borrowed Books" value="3" />
    <Card title="Due Soon" value="1" />
    <Card title="Total Fine" value="₹0" />
  </div>
);

const Books = () => (
  <Section title="Available Books">
    Browse and request books from library.
  </Section>
);

const Borrowed = () => (
  <Section title="My Borrowed Books">Issued book history here.</Section>
);

const Fines = () => <Section title="Fines">No pending fines 🎉</Section>;

const Profile = ({ user }) => (
  <Section title="My Profile">
    {user ? (
      <div className="space-y-2">
        <p>
          <strong>Name:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Course:</strong> {user.course}
        </p>
        <p>
          <strong>Enrollment:</strong> {user.enrollment}
        </p>
        <p>
          <strong>School:</strong> {user.school}
        </p>
      </div>
    ) : (
      "No user data"
    )}
  </Section>
);

const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-3xl font-bold mt-2">{value}</h2>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-600">{children}</p>
  </div>
);

export default StudentDashboard;
