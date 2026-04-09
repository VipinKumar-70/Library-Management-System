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

export const fetchBooksApi = async (page = 1) => {
  const res = await fetch(`${BASE_URL}/books/booklist?page=${page}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
};

export const deleteBookApi = async (id) => {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Delete failed");
  return res.json();
};

export const updateBookApi = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) throw new Error("Update failed");
  return res.json();
};

export const bulkUploadBooksApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/books/bulk-upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  return res.json();
};

export const getRecommendationsApi = async () => {
  const res = await fetch(`${BASE_URL}/api/recommend`, {
    credentials: "include",
  });

  return res.json();
};