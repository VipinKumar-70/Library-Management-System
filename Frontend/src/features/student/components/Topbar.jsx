const Topbar = ({ user, active, setOpen }) => {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <button onClick={() => setOpen((prev) => !prev)} className="md:hidden">
        ☰
      </button>

      <h3 className="text-lg font-semibold capitalize">{active}</h3>

      <div className="text-gray-600 font-medium">
        {user?.username || "Student"}
      </div>
    </header>
  );
};

export default Topbar;