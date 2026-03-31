const StatsCard = ({ title, value, color }) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300`}
    >
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2 text-gray-800">{value}</h2>

      <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${color}`} />
    </div>
  );
};

export default StatsCard;
