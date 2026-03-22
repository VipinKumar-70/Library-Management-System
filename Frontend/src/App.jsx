import { Routes, Route } from "react-router-dom";

import MainLayout from "./Pages/MainLayout";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import StudentDashboard from "./features/student/pages/StudentDashboard";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/adminAuthContext";
import { BookProvider } from "./context/BookContext";
import PageNotFound from "./Pages/PageNotFound";
import AdminLogin from "./Pages/AdminLogin";
import ProtectAdmin from "./components/ProtectAdmin";
import ManageBooks from "./features/admin/components/ManageBooks ";
import AdminStudents from "./features/admin/components/AdminStudents";

function App() {
  return (
    <>
      <AuthProvider>
        <AdminAuthProvider>
          <BookProvider>
            <Routes>
              {/* Pages with Navbar + Footer */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Pages without Navbar/Footer */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/dashboard"
                element={
                  <ProtectAdmin>
                    <AdminDashboard />
                  </ProtectAdmin>
                }
              />

              <Route
                path="/admin/manage-books"
                element={
                  <ProtectAdmin>
                    <ManageBooks />
                  </ProtectAdmin>
                }
              />

              <Route
                path="/admin/students"
                element={
                  <ProtectAdmin>
                    <AdminStudents />
                  </ProtectAdmin>
                }
              />

              <Route path="/admin/login" element={<AdminLogin />} />

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BookProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </>
  );
}

export default App;
