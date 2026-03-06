import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
      {/* 404 Box */}
      <div
        className="border-4 border-black bg-pink-500 text-white text-8xl font-bold px-8 py-4"
        style={{ boxShadow: "10px 10px 0px black" }}
      >
        404
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold">Page Not Found</h2>

      {/* Description */}
      <p className="text-gray-600 max-w-md">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="border-4 border-black bg-yellow-300 px-6 py-2 font-bold hover:translate-x-1 hover:translate-y-1 transition"
        style={{ boxShadow: "6px 6px 0px black" }}
      >
        Go Home →
      </Link>
    </div>
  );
};

export default PageNotFound;
