import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          SmartLibrary
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 font-medium">
          <Link className="hover:text-indigo-600" to="/">Home</Link>
          <Link className="hover:text-indigo-600" to="/books">Books</Link>
          <Link className="hover:text-indigo-600" to="/dashboard">Dashboard</Link>
          <Link className="hover:text-indigo-600" to="/about">About</Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-4">
          <Link to="/login" className="px-4 py-2 border rounded-lg hover:bg-indigo-50">
            Login
          </Link>

          <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Register
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg px-4 pb-4 space-y-3">
          <Link to="/" className="block">Home</Link>
          <Link to="/books" className="block">Books</Link>
          <Link to="/dashboard" className="block">Dashboard</Link>
          <Link to="/about" className="block">About</Link>

          <div className="flex gap-3 pt-2">
            <Link to="/login" className="border px-4 py-2 rounded-lg">Login</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
