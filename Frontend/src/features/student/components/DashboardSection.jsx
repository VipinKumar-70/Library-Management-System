import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import { getDashboardApi, returnBookApi } from "../../../api/book/borrowApi";

const DashboardSection = () => {
  const [data, setData] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboardApi();
      setData(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!data)
    return (
      <div className="p-6 flex justify-center items-center h-[60vh]">
        <div className="animate-pulse text-gray-500 text-lg">
          Loading dashboard...
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatsCard
          title="Pending"
          value={data.pending}
          color="from-yellow-400 to-yellow-200"
        />
        <StatsCard
          title="Approved"
          value={data.approved}
          color="from-blue-500 to-blue-300"
        />
        <StatsCard
          title="Returned"
          value={data.returned}
          color="from-green-500 to-green-300"
        />
        <StatsCard
          title="Overdue"
          value={data.overdue}
          color="from-red-500 to-red-300"
        />
      </div>

      {/* My Books */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">
          📚 My Books
        </h2>

        <div className="space-y-4">
          {data.borrows.map((b) => {
            const today = new Date();
            const dueDate = new Date(b.dueDate);
            const diffDays = Math.ceil(
              (dueDate - today) / (1000 * 60 * 60 * 24),
            );

            return (
              <div
                key={b._id}
                className="flex justify-between items-center p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <p className="font-semibold text-gray-800">{b.book.title}</p>

                  <p className="text-xs mt-1 text-gray-500">
                    {b.status === "approved" &&
                      (diffDays < 0
                        ? `⚠️ ${Math.abs(diffDays)} days overdue`
                        : `⏳ ${diffDays} days left`)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                      b.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : b.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {b.status}
                  </span>

                  {b.status === "approved" && (
                    <button
                      onClick={async () => {
                        await returnBookApi(b._id);
                        fetchDashboard();
                      }}
                      className="text-sm px-4 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95 transition-all"
                    >
                      Return
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fines */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">⚠️ Fines</h2>

        <div className="space-y-3">
          {data.borrows
            .filter((b) => b.fine > 0)
            .map((b) => (
              <div
                key={b._id}
                className="p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-md transition-all duration-200 space-y-4"
              >
                {/* Top Row */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {b.book.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      by {b.book.author || "Unknown Author"}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                      b.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : b.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {b.book.description || "No description available"}
                </p>

                {/* Dates */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>
                    📅 Borrowed: {new Date(b.createdAt).toLocaleDateString()}
                  </span>

                  <span>
                    ⏰ Due: {new Date(b.dueDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Progress / Time */}
                {b.status === "approved" && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {diffDays < 0
                        ? `⚠️ ${Math.abs(diffDays)} days overdue`
                        : `⏳ ${diffDays} days left`}
                    </p>

                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          diffDays < 2
                            ? "bg-red-500 w-5/6"
                            : diffDays < 5
                              ? "bg-yellow-400 w-2/3"
                              : "bg-green-500 w-1/3"
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Action */}
                {b.status === "approved" && (
                  <div className="flex justify-end">
                    <button
                      onClick={async () => {
                        await returnBookApi(b._id);
                        fetchDashboard();
                      }}
                      className="text-sm px-4 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95 transition-all"
                    >
                      Return Book
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
