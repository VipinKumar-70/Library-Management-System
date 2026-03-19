import React, { useState } from "react";
import { useBook } from "../../../context/BookContext";

const ManageBooks = () => {
  const { addBook, books, loading } = useBook();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    totalCopies: "",
    bookType: "physical",
    coverImage: null,
    bookFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      // file input
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("totalCopies", formData.totalCopies);
    data.append("bookType", formData.bookType);
    // if (formData.coverImage) data.append("coverImage", formData.coverImage);
    if (formData.bookFile) data.append("book", formData.bookFile);

    const addedBook = await addBook(data); // pass formData to context
    if (addedBook) {
      // reset form only if book successfully added
      setFormData({
        title: "",
        author: "",
        category: "",
        description: "",
        totalCopies: "",
        bookType: "physical",
        coverImage: null,
        bookFile: null,
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - same as AdminDashboard */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-indigo-600">
          SmartLibrary
        </div>
        <nav className="flex-1 p-6 space-y-4">
          <button className="block w-full text-left py-2 px-3 rounded hover:bg-indigo-600 transition">
            Dashboard
          </button>
          <button className="block w-full text-left py-2 px-3 rounded bg-indigo-600 transition">
            Manage Books
          </button>
          {/* other sidebar buttons */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 flex gap-6">
        {/* Left: Add Book Form */}
        <section className="w-1/3 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              name="author"
              placeholder="Author"
              value={formData.author}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="totalCopies"
              placeholder="Total Copies"
              value={formData.totalCopies}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <select
              name="bookType"
              value={formData.bookType}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
              <option value="both">Both</option>
            </select>
            {/* <input
              type="file"
              name="coverImage"
              onChange={handleChange}
              className="border p-2 rounded"
            /> */}
            <input
              type="file"
              name="bookFile"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              {loading ? "Uploading..." : "Add Book"}
            </button>
          </form>
        </section>

        {/* Right: Book List */}
        <section className="flex-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Books List</h2>
          {books.length === 0 ? (
            <p className="text-gray-500">No books added yet.</p>
          ) : (
            <ul className="space-y-3 max-h-[600px] overflow-auto">
              {books.map((book) => (
                <li
                  key={book._id}
                  className="border p-3 rounded flex justify-between items-center"
                >
                  <span>{book.title}</span>
                  {book.pdfUrl && (
                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      className="text-indigo-600 hover:underline"
                    >
                      View PDF
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default ManageBooks;
