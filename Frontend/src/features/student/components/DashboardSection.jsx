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
      {/* 🔥 Stats */}
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

      {/* 📚 My Books */}
      <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          📚 My Books
        </h2>

        {data.borrows.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No activity yet 📭</p>
        ) : (
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
                  className="flex justify-between items-center p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {b.book.title}
                    </p>

                    <p className="text-xs mt-1 text-gray-500">
                      {b.status === "approved" &&
                        (diffDays < 0
                          ? `⚠️ ${Math.abs(diffDays)} days overdue`
                          : `⏳ ${diffDays} days left`)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status */}
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        b.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : b.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {b.status}
                    </span>

                    {/* Return Button */}
                    {b.status === "approved" && (
                      <button
                        onClick={async () => {
                          await returnBookApi(b._id);
                          fetchDashboard();
                        }}
                        className="text-sm px-3 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95 transition"
                      >
                        Return
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ⚠️ Fines */}
      <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          ⚠️ Fines
        </h2>

        {data.borrows.filter((b) => b.fine > 0).length === 0 ? (
          <p className="text-gray-400 text-center py-6">No fines 🎉</p>
        ) : (
          <div className="space-y-3">
            {data.borrows
              .filter((b) => b.fine > 0)
              .map((b) => (
                <div
                  key={b._id}
                  className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
                >
                  <span className="text-gray-700 font-medium">
                    {b.book.title}
                  </span>
                  <span className="text-red-600 font-semibold">₹{b.fine}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSection;
