import { registerUser, loginUser, logoutUser } from "./user/authApi";
import {
  userProfile,
  getAllStudents,
  updateStudent,
  deleteStudent,
} from "./user/userApi";
import { adminProfile } from "./admin/adminApi";
import { loginAdmin, logoutAdmin } from "./admin/authAdmin";
import {
  fetchBooksApi,
  uploadBookApi,
  deleteBookApi,
  updateBookApi,
  bulkUploadBooksApi,
  getRecommendationsApi,
} from "./book/BookApi";
import {
  requestBookApi,
  getDashboardApi,
  returnBookApi,
  getAdminStatsApi,
  getAllBorrowsApi,
  approveBorrowApi,
  rejectBorrowApi,
} from "./book/borrowApi";

import { getAnalyticsApi } from "./book/analyticsApi";

export {
  // User/Student
  registerUser,
  loginUser,
  logoutUser,
  userProfile,
  getAllStudents,
  updateStudent,
  deleteStudent,
  // admin
  loginAdmin,
  logoutAdmin,
  adminProfile,
  // Book
  fetchBooksApi,
  uploadBookApi,
  deleteBookApi,
  updateBookApi,
  bulkUploadBooksApi,
  getRecommendationsApi,
  // Borrow
  requestBookApi,
  getDashboardApi,
  returnBookApi,
  getAdminStatsApi,
  getAllBorrowsApi,
  approveBorrowApi,
  rejectBorrowApi,
  // Analytics
  getAnalyticsApi,
};
