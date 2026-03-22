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
} from "./book/BookApi";

export {
  registerUser,
  loginUser,
  logoutUser,
  userProfile,
  getAllStudents,
  updateStudent,
  deleteStudent,
  adminProfile,
  loginAdmin,
  logoutAdmin,
  fetchBooksApi,
  uploadBookApi,
  deleteBookApi,
  updateBookApi,
};
