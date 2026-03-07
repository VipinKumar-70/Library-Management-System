const TaskCard = ({ title, description, status }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{title}</h3>

        <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
          MEDIUM
        </span>
      </div>

      <p className="text-gray-500 mt-2">{description}</p>

      <div className="mt-4 text-sm text-gray-500">
        Status: {status}
      </div>

      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded">
          <div className="h-2 bg-indigo-600 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;