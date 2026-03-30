const BASE_URL = import.meta.env.VITE_BASE_URL;

// ================= STUDENT =================

// 📥 Request book
export const requestBookApi = (bookId) =>
  fetch(`${BASE_URL}/borrow/request`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId }),
  }).then((res) => res.json());

// 📊 Dashboard
export const getDashboardApi = () =>
  fetch(`${BASE_URL}/borrow/dashboard`, {
    credentials: "include",
  }).then((res) => res.json());

// 🔄 Return book
export const returnBookApi = (id) =>
  fetch(`${BASE_URL}/borrow/return/${id}`, {
    method: "PUT",
    credentials: "include",
  }).then((res) => res.json());

// ================= ADMIN =================

// 📊 Admin Stats
export const getAdminStatsApi = async () => {
  const res = await fetch(`${BASE_URL}/borrow/admin/stats`, {
    credentials: "include",
  });
  return res.json();
};

// 📋 All Borrow Requests
export const getAllBorrowsApi = async () => {
  const res = await fetch(`${BASE_URL}/borrow/admin/borrows`, {
    credentials: "include",
  });
  return res.json();
};

// ✅ Approve Request
export const approveBorrowApi = async (id) => {
  const res = await fetch(`${BASE_URL}/borrow/admin/approve/${id}`, {
    method: "PUT",
    credentials: "include",
  });
  return res.json();
};

// ❌ Reject Request (NEW)
export const rejectBorrowApi = async (id) => {
  const res = await fetch(`${BASE_URL}/borrow/admin/reject/${id}`, {
    method: "PUT",
    credentials: "include",
  });
  return res.json();
};
