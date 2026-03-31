const Topbar = ({ user, active, setOpen }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm px-6 py-4 flex justify-between items-center rounded-b-2xl">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="md:hidden text-xl"
      >
        ☰
      </button>

      <h3 className="text-lg font-semibold capitalize text-gray-700">
        {active}
      </h3>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-500 hidden md:block">
          {new Date().toDateString()}
        </div>

        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
          {user?.username || "Student"}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
