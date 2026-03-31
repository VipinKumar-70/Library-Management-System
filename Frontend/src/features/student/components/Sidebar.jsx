const MenuItem = ({ label, active, setActive }) => (
  <button
    onClick={() => setActive(label.toLowerCase())}
    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3
      ${
        active === label.toLowerCase()
          ? "bg-white text-indigo-700 shadow-sm font-medium"
          : "text-indigo-100 hover:bg-indigo-600/70 hover:pl-5"
      }`}
  >
    {label}
  </button>
);

const Sidebar = ({ open, setOpen, active, setActive, handleLogout }) => {
  return (
    <aside
      className={`fixed md:static top-0 z-40 h-screen w-64 bg-gradient-to-b from-indigo-700 to-indigo-800 text-white transition-all duration-300 ${
        open ? "left-0" : "-left-64"
      } md:left-0 shadow-xl`}
    >
      <div className="p-6 border-b border-indigo-500/30">
        <h2 className="text-2xl font-bold tracking-wide">SmartLibrary</h2>
        <p className="text-xs text-indigo-200 mt-1">Student Panel</p>
      </div>

      <nav className="p-4 space-y-2">
        <MenuItem label="Dashboard" active={active} setActive={setActive} />
        <MenuItem label="Books" active={active} setActive={setActive} />
        <MenuItem label="Profile" active={active} setActive={setActive} />

        <div className="pt-10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-xl bg-red-500/90 hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
