import React, { useEffect, useState } from "react";
import AddBookModal from "../components/AddBookModal";
import { useBook } from "../../../context/BookContext";

export default function ManageBooks() {
  const { books, loading, fetchBooks } = useBook();
  const [filter, setFilter] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks =
    books?.filter(
      (book) =>
        book.title?.toLowerCase().includes(filter.toLowerCase()) ||
        book.author?.toLowerCase().includes(filter.toLowerCase()),
    ) || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Books</h1>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Filter books..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Add New Book
        </button>
      </div>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Book</th>
            <th className="text-left p-2">Category</th>
            <th className="text-left p-2">Copies</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="5" className="p-4 text-center">
                Loading books...
              </td>
            </tr>
          )}

          {!loading && filteredBooks.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No books found.
              </td>
            </tr>
          )}

          {!loading &&
            filteredBooks.map((book) => (
              <tr key={book._id} className="border-t">
                <td className="p-2 flex items-center space-x-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-12 h-16 object-cover"
                  />
                  <div>
                    <div className="font-semibold">{book.title}</div>
                    <div className="text-sm text-gray-600">{book.author}</div>
                  </div>
                </td>
                <td className="p-2 uppercase text-indigo-600">
                  {book.category}
                </td>
                <td className="p-2">
                  {book.availableCopies} / {book.totalCopies} <br />
                  <span className="text-sm text-gray-500">Available</span>
                </td>
                <td className="p-2">
                  <span
                    className={`${
                      book.availableCopies > 0
                        ? "text-green-600"
                        : "text-red-600"
                    } font-semibold`}
                  >
                    {book.availableCopies > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="p-2 space-x-2">
                  {/* Add real functionality later */}
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                  <button className="text-yellow-600 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isAddModalOpen && (
        <AddBookModal onClose={() => setAddModalOpen(false)} />
      )}
    </div>
  );
}
