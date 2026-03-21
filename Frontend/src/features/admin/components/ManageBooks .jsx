import React, { useEffect, useState, useMemo } from "react";
import AddBookModal from "../components/AddBookModal";
import { useBook } from "../../../context/BookContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ManageBooks() {
  const { books, loading, fetchBooks, deleteBook, page, totalPages, setPage } =
    useBook();

  const [filter, setFilter] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [editBook, setEditBook] = useState(null);

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  const filteredBooks = useMemo(() => {
    return (
      books?.filter(
        (book) =>
          book.title?.toLowerCase().includes(filter.toLowerCase()) ||
          book.author?.toLowerCase().includes(filter.toLowerCase()),
      ) || []
    );
  }, [books, filter]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Books</h1>

        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + Add Book
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/3 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
              <th className="p-4 text-left">Book</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Availability</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400">
                  Loading books...
                </td>
              </tr>
            ) : filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400">
                  No books found
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr
                  key={book._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Book */}
                  <td className="p-4 flex items-center gap-4">
                    <img
                      src={`${BASE_URL}${book.coverImage}`}
                      className="w-12 h-16 rounded-md object-fit shadow"
                      onError={(e) => (e.target.src = "/no-image.jpg")}
                    />
                    <div>
                      <div className="font-medium text-gray-800">
                        {book.title}
                      </div>
                      <div className="text-sm text-gray-500">{book.author}</div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                      {book.category}
                    </span>
                  </td>

                  {/* 🔥 Availability (SMART) */}
                  <td className="p-4 text-gray-700">
                    {book.bookType === "physical" && (
                      <>
                        <span className="font-medium">
                          {book.availableCopies}/{book.totalCopies}
                        </span>
                        <div className="text-xs text-gray-400">Physical</div>
                      </>
                    )}

                    {book.bookType === "digital" && (
                      <span className="text-blue-600 font-medium">
                        PDF Only
                      </span>
                    )}

                    {book.bookType === "both" && (
                      <>
                        <span className="font-medium">
                          {book.availableCopies}/{book.totalCopies}
                        </span>
                        <div className="text-xs text-gray-400">
                          Physical + PDF
                        </div>
                      </>
                    )}
                  </td>

                  {/* 🔥 Status */}
                  <td className="p-4">
                    {book.bookType === "physical" && (
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          book.availableCopies > 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {book.availableCopies > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    )}

                    {book.bookType === "digital" && (
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 text-xs rounded-full font-medium">
                        PDF Available
                      </span>
                    )}

                    {book.bookType === "both" && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            book.availableCopies > 0
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {book.availableCopies > 0 ? "In Stock" : "Out"}
                        </span>

                        <span className="bg-blue-100 text-blue-600 px-3 py-1 text-xs rounded-full font-medium">
                          PDF
                        </span>
                      </div>
                    )}
                  </td>

                  {/* 🔥 Actions */}
                  <td className="p-4 text-center space-x-3">
                    {(book.bookType === "digital" ||
                      book.bookType === "both") && (
                      <button
                        onClick={() =>
                          setSelectedPDF(`${BASE_URL}${book.pdfUrl}`)
                        }
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        View PDF
                      </button>
                    )}

                    <button
                      onClick={() => setEditBook(book)}
                      className="text-yellow-500 hover:text-yellow-600 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Delete this book?")) {
                          deleteBook(book._id);
                        }
                      }}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-md text-sm ${
              page === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* PDF Viewer */}
      {selectedPDF && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[90%] h-[90%] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="font-semibold text-gray-700">PDF Preview</h2>
              <button
                onClick={() => setSelectedPDF(null)}
                className="text-red-500 hover:text-red-700"
              >
                Close ✕
              </button>
            </div>

            <iframe
              src={selectedPDF}
              className="flex-1 w-full"
              title="PDF Viewer"
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {editBook && (
        <AddBookModal book={editBook} onClose={() => setEditBook(null)} />
      )}

      {isAddModalOpen && (
        <AddBookModal onClose={() => setAddModalOpen(false)} />
      )}
    </div>
  );
}
