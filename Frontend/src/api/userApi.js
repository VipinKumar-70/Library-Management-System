const BASE_URL = import.meta.env.VITE_BASE_URL;

export const userProfile = async (data) => {
  const res = await fetch(`${BASE_URL}/api/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
};
