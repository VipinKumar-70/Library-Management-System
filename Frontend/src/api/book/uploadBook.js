const BASE_URL = import.meta.env.VITE_BASE_URL;

export const uploadBookApi = async (formData) => {
  const res = await fetch(`${BASE_URL}/books/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to upload book");
  }

  return res.json();
};

export const fetchBooksApi = async () => {
  const res = await fetch(`${BASE_URL}/booklist`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
};
