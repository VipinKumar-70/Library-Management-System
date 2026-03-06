import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import StudentDashboard from "./Pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/authContext";

function App() {
  const location = useLocation();

  // Hide navbar on student dashboard
  const hideNavbar = location.pathname.startsWith("/student");

  return (
    <>
      <AuthProvider>
        {!hideNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
