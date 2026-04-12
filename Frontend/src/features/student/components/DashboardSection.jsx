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
      setRecommendations(res.data || []);
      setRecType(res.type || "");
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
        <div className="animate-pulse text-gray-400 text-base">
          Loading dashboard...
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* ================= Stats ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Pending"
          value={data.pending}
          bg="bg-amber-50"
          labelColor="text-amber-700"
          valueColor="text-amber-900"
        />
        <StatCard
          label="Approved"
          value={data.approved}
          bg="bg-blue-50"
          labelColor="text-blue-700"
          valueColor="text-blue-900"
        />
        <StatCard
          label="Returned"
          value={data.returned}
          bg="bg-green-50"
          labelColor="text-green-700"
          valueColor="text-green-900"
        />
        <StatCard
          label="Overdue"
          value={data.overdue}
          bg="bg-red-50"
          labelColor="text-red-700"
          valueColor="text-red-900"
        />
      </div>

      {/* ================= Recommendations ================= */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            {recType === "trending" ? "Trending Books" : "Recommended For You"}
          </h2>
          {recType === "personalized" && (
            <span className="text-xs text-gray-400">
              Based on your activity
            </span>
          )}
        </div>

        {loadingRec ? (
          <p className="text-sm text-gray-400">Loading recommendations...</p>
        ) : recommendations.length === 0 ? (
          <p className="text-sm text-gray-400">No recommendations available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {recommendations.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-sm transition-shadow group"
              >
                <div className="h-36 overflow-hidden bg-indigo-50">
                  <img
                    src={
                      book.coverImage
                        ? `${BASE_URL}${book.coverImage}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                <div className="p-2.5 flex flex-col gap-1 flex-1">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                    {book.title || "No title"}
                  </p>
                  <p className="text-[11px] text-gray-500 line-clamp-1">
                    {book.author || "Unknown"}
                  </p>
                  <p className="text-[10px] text-gray-400 line-clamp-2">
                    {book.description || ""}
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                      {book.category || "General"}
                    </span>
                    <button
                      onClick={async () => {
                        await requestBookApi(book._id);
                        await fetchDashboard();
                        await fetchRecommendations();
                      }}
                      className="text-[10px] px-2.5 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md font-medium transition-colors"
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
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">
          My Books
        </h2>

        <div className="space-y-2.5">
          {data.borrows
            ?.filter((b) => b.book)
            .map((b) => {
              const today = new Date();
              const dueDate = new Date(b.dueDate);
              const diffDays = Math.ceil(
                (dueDate - today) / (1000 * 60 * 60 * 24),
              );

              return (
                <div
                  key={b._id}
                  className="flex justify-between items-center p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800"> 
                      {b.book?.title || "Book deleted"}
                    </p>
                    {b.status === "approved" && (
                      <p
                        className={`text-xs mt-1 font-medium ${diffDays < 0 ? "text-red-500" : "text-green-600"}`}
                      >
                        {diffDays < 0
                          ? `${Math.abs(diffDays)} days overdue`
                          : `${diffDays} days remaining`}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-500 font-medium capitalize">
                      {b.status}
                    </span>
                    {b.status === "approved" && (
                      <button
                        onClick={async () => {
                          await returnBookApi(b._id);
                          await fetchDashboard();
                          await fetchRecommendations();
                        }}
                        className="text-xs px-3.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
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
      {data.borrows?.some((b) => b.fine > 0 && b.book) && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">
            Fines
          </h2>

          <div className="space-y-2.5">
            {data.borrows
              ?.filter((b) => b.fine > 0 && b.book)
              .map((b) => (
                <div
                  key={b._id}
                  className="flex justify-between items-center p-3.5 rounded-xl bg-red-50 border border-red-100"
                >
                  <p className="text-sm font-semibold text-red-900">
                    {b.book?.title || "Book deleted"}
                  </p>
                  <p className="text-sm font-semibold text-red-600">
                    ₹{b.fine}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Inline stat card ─── */
const StatCard = ({ label, value, bg, labelColor, valueColor }) => (
  <div className={`${bg} rounded-xl p-4`}>
    <p
      className={`text-[11px] font-semibold uppercase tracking-widest ${labelColor}`}
    >
      {label}
    </p>
    <p className={`text-3xl font-medium mt-1 ${valueColor}`}>{value ?? 0}</p>
  </div>
);

export default DashboardSection;
