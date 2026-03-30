import React, { useState } from "react";

const BookRequest = ({ borrows, onApprove }) => {
  const [searchName, setSearchName] = useState("");
  const [filteredBorrows, setFilteredBorrows] = useState(borrows);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 🔍 HANDLE SEARCH (ONLY WHEN BUTTON CLICK)
  const handleSearch = () => {
    const result = borrows.filter((b) => {
      const name = b.user?.username?.toLowerCase() || "";

      const nameMatch = name.includes(searchName.toLowerCase());

      return nameMatch;
    });

    setFilteredBorrows(result);
  };

  // 🔄 Reset Search
  const handleReset = () => {
    setSearchName("");
    setFilteredBorrows(borrows);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-5">📚 Borrow Requests</h2>

      {/* 🔍 SEARCH */}
      <div className="flex gap-4 mb-6 flex-wrap items-center">
        <input
          type="text"
          placeholder="Search by student name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Search
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/* 📭 EMPTY */}
      {filteredBorrows.length === 0 ? (
        <p className="text-gray-400 text-center py-6">No requests found 📭</p>
      ) : (
        <div className="space-y-4">
          {filteredBorrows.map((b) => (
            <div
              key={b._id}
              className="flex justify-between items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
            >
              {/* LEFT */}
              <div
                onClick={() => setSelectedStudent(b.user)}
                className="cursor-pointer"
              >
                <p className="font-semibold text-gray-800">
                  {b.user?.username}
                </p>
                <p className=" text-sm text-gray-500 hover:text-indigo-600">
                  {b.book?.title}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    b.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : b.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {b.status}
                </span>

                {b.status === "pending" && (
                  <button
                    onClick={() => onApprove(b._id)}
                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 active:scale-95 transition"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 STUDENT MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-lg rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold">
                {selectedStudent.username?.charAt(0).toUpperCase()}
              </div>
              <h3 className="mt-2 text-lg font-semibold">
                {selectedStudent.username}
              </h3>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <b>Email:</b> {selectedStudent.email}
              </p>
              <p>
                <b>Course:</b> {selectedStudent.course}
              </p>
              <p>
                <b>Enrollment:</b> {selectedStudent.enrollment}
              </p>
              <p>
                <b>School:</b> {selectedStudent.school}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRequest;
