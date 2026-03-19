const BASE_URL = import.meta.env.VITE_BASE_URL;

export const adminProfile = async () => {
  const res = await fetch(`${BASE_URL}/admin/profile`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }

  return res.json();
};  