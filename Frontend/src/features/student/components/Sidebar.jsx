const MenuItem = ({ label, active, setActive }) => (
  <button
    onClick={() => setActive(label.toLowerCase())}
    className={`w-full text-left px-4 py-3 rounded-lg transition ${
      active === label.toLowerCase()
        ? "bg-white text-indigo-700"
        : "hover:bg-indigo-600"
    }`}
  >
    {label}
  </button>
);

const Sidebar = ({ open, setOpen, active, setActive, handleLogout }) => {
  return (
    <aside
      className={`fixed md:static top-0 z-40 h-screen w-64 bg-indigo-700 text-white transition-all ${
        open ? "left-0" : "-left-64"
      } md:left-0`}
    >
      <div className="p-6 border-b border-indigo-500">
        <h2 className="text-2xl font-bold">SmartLibrary</h2>
      </div>

      <nav className="p-4 space-y-2">
        <MenuItem label="Dashboard" active={active} setActive={setActive} />
        <MenuItem label="Books" active={active} setActive={setActive} />
        <MenuItem label="Borrowed" active={active} setActive={setActive} />
        <MenuItem label="Fines" active={active} setActive={setActive} />
        <MenuItem label="Profile" active={active} setActive={setActive} />

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
  );
};

export default Sidebar;
