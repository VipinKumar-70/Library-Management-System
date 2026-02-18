import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-gray-800">
      {/* HERO */}
      <section className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-32 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Smart Library <br /> Management System
            </h1>

            <p className="mt-6 text-lg opacity-90">
              Digitize your library with powerful tools to manage books,
              students, and borrowing — all in one platform.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/register"
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium hover:scale-105 transition"
              >
                Get Started
              </Link>

              <Link
                to="/books"
                className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-600 transition"
              >
                Browse Books
              </Link>
            </div>
          </div>

          <img
            src="https://illustrations.popsy.co/white/bookshelf.svg"
            className="hidden md:block"
            alt=""
          />
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ["500+", "Books"],
            ["300+", "Students"],
            ["50+", "Staff"],
            ["24/7", "Access"],
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-3xl font-bold text-indigo-600">{item[0]}</h2>
              <p className="mt-2">{item[1]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">Powerful Features</h2>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              ["📚 Book Management", "Add, update and track books easily."],
              ["👥 Student Records", "Manage students and issue history."],
              ["📊 Admin Dashboard", "Real-time insights and reports."],
              ["🔐 Secure Login", "Role based authentication system."],
              ["⚡ Fast Search", "Instant book searching."],
              ["☁ Cloud Storage", "MongoDB powered backend."],
            ].map((f, i) => (
              <div
                key={i}
                className="border p-6 rounded-xl hover:-translate-y-2 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold">{f[0]}</h3>
                <p className="mt-3 text-gray-600">{f[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">
            Ready to modernize your library?
          </h2>

          <p className="mt-4 opacity-90">
            Start managing everything digitally today.
          </p>

          <Link
            to="/register"
            className="inline-block mt-8 bg-white text-indigo-600 px-8 py-3 rounded-xl font-medium hover:scale-105 transition"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
