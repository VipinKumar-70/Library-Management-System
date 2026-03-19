const BASE_URL = import.meta.env.VITE_BASE_URL;

export const uploadbookApi = async (formData) => {
  const res = await fetch(`${BASE_URL}/books/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  return res.json();
};
