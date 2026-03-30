import React, { useEffect, useState, useMemo } from "react";
import { useBook } from "../../../context/BookContext";
import { requestBookApi, getDashboardApi } from "../../../api/book/borrowApi";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const BooksSection = () => {
  const { books, loading, fetchBooks, page, totalPages, setPage } = useBook();

  const [search, setSearch] = useState("");
  const [selectedPDF, setSelectedPDF] = useState(null);

  // 🔥 New States
  const [requesting, setRequesting] = useState({});
  const [borrowMap, setBorrowMap] = useState({});

  // 📚 Fetch Books
  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  // 🔥 Fetch Borrow Status (REAL DATA)
  useEffect(() => {
    const fetchBorrowData = async () => {
      try {
        const res = await getDashboardApi();

        const map = {};
        res.borrows.forEach((b) => {
          map[b.book._id] = b.status; // pending / approved / returned
        });

        setBorrowMap(map);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBorrowData();
  }, []);

  // 🔍 Filter books
  const filteredBooks = useMemo(() => {
    return (
      books?.filter(
        (book) =>
          book.title?.toLowerCase().includes(search.toLowerCase()) ||
          book.author?.toLowerCase().includes(search.toLowerCase()),
      ) || []
    );
  }, [books, search]);

  // 📥 Borrow Request
  const handleBorrow = async (bookId) => {
    try {
      setRequesting((prev) => ({ ...prev, [bookId]: true }));

      const res = await requestBookApi(bookId);

      if (res.message === "Request sent") {
        setBorrowMap((prev) => ({
          ...prev,
          [bookId]: "pending",
        }));
      }

      alert(res.message);
    } catch (err) {
      console.error(err);
    } finally {
      setRequesting((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4">Available Books</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title or author..."
        className="w-full md:w-1/3 mb-6 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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
                <td colSpan="5" className="text-center p-10 text-gray-400">
                  Loading books...
                </td>
              </tr>
            ) : filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-10 text-gray-400">
                  No books found
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => {
                const status = borrowMap[book._id];

                return (
                  <tr key={book._id} className="border-t hover:bg-gray-50">
                    {/* Book */}
                    <td className="p-4 flex items-center gap-4">
                      <img
                        src={`${BASE_URL}${book.coverImage}`}
                        className="w-12 h-16 rounded-md object-cover"
                        onError={(e) => (e.target.src = "/no-image.jpg")}
                      />
                      <div>
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-gray-500">
                          {book.author}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs">
                        {book.category}
                      </span>
                    </td>

                    {/* Availability */}
                    <td className="p-4">
                      {book.bookType === "physical" && (
                        <span>
                          {book.availableCopies}/{book.totalCopies}
                        </span>
                      )}

                      {book.bookType === "digital" && (
                        <span className="text-blue-600 font-medium">
                          PDF Available
                        </span>
                      )}

                      {book.bookType === "both" && (
                        <span>
                          {book.availableCopies}/{book.totalCopies} + PDF
                        </span>
                      )}
                    </td>

                    {/* 🔥 Status */}
                    <td className="p-4">
                      {status === "pending" && (
                        <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs">
                          Pending
                        </span>
                      )}

                      {status === "approved" && (
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                          Approved
                        </span>
                      )}

                      {status === "returned" && (
                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">
                          Returned
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center space-x-3">
                      {/* 📖 Read */}
                      {(book.bookType === "digital" ||
                        book.bookType === "both") && (
                        <button
                          onClick={() =>
                            setSelectedPDF(`${BASE_URL}${book.pdfUrl}`)
                          }
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Read
                        </button>
                      )}

                      {/* 📥 Borrow */}
                      {(book.bookType === "physical" ||
                        book.bookType === "both") && (
                        <button
                          disabled={
                            book.availableCopies === 0 ||
                            requesting[book._id] ||
                            status === "pending" ||
                            status === "approved"
                          }
                          onClick={() => handleBorrow(book._id)}
                          className={`text-sm ${
                            book.availableCopies === 0
                              ? "text-gray-400"
                              : status === "pending"
                                ? "text-yellow-600"
                                : status === "approved"
                                  ? "text-green-600"
                                  : "text-indigo-600 hover:text-indigo-800"
                          }`}
                        >
                          {requesting[book._id]
                            ? "Sending..."
                            : book.availableCopies === 0
                              ? "Out of Stock"
                              : status === "pending"
                                ? "Requested"
                                : status === "approved"
                                  ? "Borrowed"
                                  : "Borrow"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
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
            className={`px-3 py-1 rounded-md ${
              page === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 📖 PDF Viewer */}
      {selectedPDF && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded-xl overflow-hidden">
            <div className="flex justify-between p-3 border-b">
              <h3 className="font-semibold">Reading Book</h3>
              <button onClick={() => setSelectedPDF(null)}>Close ✕</button>
            </div>

            <iframe src={selectedPDF} className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksSection;
