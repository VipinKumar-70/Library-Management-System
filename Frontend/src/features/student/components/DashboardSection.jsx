import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import {
  getDashboardApi,
  returnBookApi,
  requestBookApi,
  getRecommendationsApi,
} from "../../../api/index";


const BASE_URL = import.meta.env.VITE_BASE_URL;

const DashboardSection = () => {
  const [data, setData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recType, setRecType] = useState("");
  const [loadingRec, setLoadingRec] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboardApi();
      setData(res);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoadingRec(true);
      const res = await getRecommendationsApi();
      setRecommendations(res.data);
      setRecType(res.type);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRec(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchRecommendations();
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
      {/* ================= Stats ================= */}
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

      {/* ================= Recommendations ================= */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {recType === "trending"
              ? "🔥 Trending Books"
              : "🎯 Recommended For You"}
          </h2>

          {recType === "personalized" && (
            <span className="text-xs text-gray-500">
              Based on your activity
            </span>
          )}
        </div>

        {/* Content */}
        {loadingRec ? (
          <p className="text-gray-500 text-sm">Loading recommendations...</p>
        ) : recommendations.length === 0 ? (
          <p className="text-gray-500 text-sm">No recommendations available</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recommendations.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 group"
              >
                {/* Image */}
                <div className="h-52 overflow-hidden">
                  <img
                    src={
                      book.coverImage
                        ? `${BASE_URL}${book.coverImage}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={book.title}
                    className="w-full h-full object-fit group-hover:scale-105 transition-all duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-3 space-y-1">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {book.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-1">
                    {book.author}
                  </p>

                  <p className="text-[11px] text-gray-500 line-clamp-2">
                    {book.description}
                  </p>

                  {/* Bottom */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded">
                      {book.category}
                    </span>

                    <button
                      onClick={async () => {
                        await requestBookApi(book._id);
                        fetchDashboard();
                        fetchRecommendations();
                      }}
                      className="text-[10px] px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 active:scale-95 transition-all"
                    >
                      Request
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= My Books ================= */}
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
                className="flex justify-between items-center p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all"
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
                        fetchRecommendations();
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

      {/* ================= Fines ================= */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">⚠️ Fines</h2>

        <div className="space-y-3">
          {data.borrows
            .filter((b) => b.fine > 0)
            .map((b) => (
              <div
                key={b._id}
                className="p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-800">{b.book.title}</h3>

                <p className="text-sm text-gray-500">Fine: ₹{b.fine}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
