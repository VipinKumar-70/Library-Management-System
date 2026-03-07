const StatsCard = ({ title, value, color }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow p-6 border-l-4 ${color}`}
    >
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
};

export default StatsCard;