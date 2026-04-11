const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAnalyticsApi = async () => {
  const res = await fetch(`${BASE_URL}/api/analytics`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch analytics");

  return res.json();
};
