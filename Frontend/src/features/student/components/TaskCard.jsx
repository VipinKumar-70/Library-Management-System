const TaskCard = ({ title, description, status }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">{title}</h3>

        <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
          MEDIUM
        </span>
      </div>

      <p className="text-gray-500 mt-2 text-sm">{description}</p>

      <div className="mt-4 text-sm text-gray-400">Status: {status}</div>

      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-2 bg-indigo-500 rounded-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
