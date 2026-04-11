import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  // Doughnut,
} from "recharts";
import { getAnalyticsApi, getAllBorrowsApi } from "../../../api";

const PALETTE = [
  "#534AB7",
  "#1D9E75",
  "#D85A30",
  "#D4537E",
  "#378ADD",
  "#639922",
  "#BA7517",
];
const STATUS_STYLES = {
  returned: "bg-green-100 text-green-800",
  borrowed: "bg-blue-100 text-blue-800",
  overdue: "bg-red-100 text-red-800",
};

export default function AnalyticsSection() {
  const [data, setData] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [filter, setFilter] = useState("all");
  const [range, setRange] = useState("6m");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [analytics, allBorrows] = await Promise.all([
        getAnalyticsApi(),
        getAllBorrowsApi(),
      ]);
      setData(analytics);
      setBorrows(
        allBorrows.map((b) => ({
          user: b.user?.username,
          book: b.book?.title,
          category: b.book?.category,
          status: b.status,
        })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <p className="p-6 text-gray-400 animate-pulse">Loading analytics...</p>
    );
  if (!data) return <p className="p-6 text-red-500">Unauthorized / No data</p>;

  // ── Derived data ─────────────────────────────────────────────────
  const monthlyData =
    range === "6m" ? data.monthlyBorrows.slice(-6) : data.monthlyBorrows;

  // Top books
  const bookCounts = borrows.reduce((acc, b) => {
    acc[b.book] = (acc[b.book] || 0) + 1;
    return acc;
  }, {});
  const topBooks = Object.entries(bookCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const maxCount = topBooks[0]?.[1] || 1;

  const filtered =
    filter === "all" ? borrows : borrows.filter((b) => b.status === filter);

  const overdue = borrows.filter((b) => b.status === "overdue").length;
  const active = borrows.filter((b) => b.status === "borrowed").length;

  return (
    <div className="space-y-4 pb-8">
      {/* ── Metric cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total books",
            value: data.totalBooks,
            badge: "+12 this month",
            up: true,
          },
          {
            label: "Total borrows",
            value: data.totalBorrows,
            badge: "+8.4%",
            up: true,
          },
          {
            label: "Active borrows",
            value: active,
            badge: "On track",
            up: true,
          },
          {
            label: "Overdue",
            value: overdue,
            badge: "Needs action",
            up: false,
          },
        ].map(({ label, value, badge, up }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-3xl font-medium">{value?.toLocaleString()}</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block
              ${up ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {badge}
            </span>
          </div>
        ))}
      </div>

      {/* ── Monthly bar chart ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Monthly borrows</h3>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {["6m", "12m"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`text-xs px-3 py-1 rounded-md transition
                  ${range === r ? "bg-white font-medium shadow-sm" : "text-gray-500"}`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} barSize={28}>
            <XAxis
              dataKey="_id.month"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "rgba(83,74,183,0.08)" }} />
            <Bar dataKey="count" fill="#534AB7" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Pie + Top books ── */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-sm font-medium mb-3">By category</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.categoryStats.map((c, i) => (
              <span
                key={c._id}
                className="flex items-center gap-1 text-xs text-gray-500"
              >
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ background: PALETTE[i % PALETTE.length] }}
                />
                {c._id} {c.count}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data.categoryStats}
                dataKey="count"
                nameKey="_id"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {data.categoryStats.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-sm font-medium mb-4">Top books</h3>
          <div className="space-y-3">
            {topBooks.map(([title, count], i) => (
              <div key={title} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-20 truncate">
                  {title}
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round((count / maxCount) * 100)}%`,
                      background: PALETTE[i],
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-5 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Borrow table ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="text-sm font-medium mb-3">Recent borrows</h3>
        <div className="flex gap-2 mb-4 flex-wrap">
          {["all", "borrowed", "returned", "overdue"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1 rounded-full border transition
                ${
                  filter === f
                    ? "bg-blue-50 text-blue-700 border-transparent"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide">
              <th className="text-left pb-2 font-medium">User</th>
              <th className="text-left pb-2 font-medium">Book</th>
              <th className="text-left pb-2 font-medium">Category</th>
              <th className="text-left pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => (
              <tr
                key={i}
                className="border-t border-gray-50 hover:bg-gray-50 transition"
              >
                <td className="py-2">{b.user}</td>
                <td className="py-2">{b.book}</td>
                <td className="py-2 text-gray-500">{b.category}</td>
                <td className="py-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full
                    ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
