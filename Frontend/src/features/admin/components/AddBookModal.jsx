import React, { useState, useEffect } from "react";
import { useBook } from "../../../context/BookContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AddBookModal({ onClose, book }) {
  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "History",
    "Psychology",
    "Human Behaviour",
    "Philosophy",
    "Self-Help",
    "Biography",
    "Business",
    "Finance",
    "Economics",
    "Technology",
    "Programming",
    "Artificial Intelligence",
    "Data Science",
    "Health & Fitness",
    "Education",
    "Politics",
    "Religion & Spirituality",
    "Mystery",
    "Thriller",
    "Fantasy",
    "Science Fiction",
    "Poetry",
  ];

  const { addBook, updateBook } = useBook();

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: categories[0],
    description: "",
    totalCopies: 1,
    bookType: "physical",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [bookFile, setBookFile] = useState(null);

  const [coverPreview, setCoverPreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 Prefill in edit mode
  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || "",
        author: book.author || "",
        category: book.category || categories[0],
        description: book.description || "",
        totalCopies: book.totalCopies || 1,
        bookType: book.bookType || "physical",
      });

      if (book.coverImage) {
        setCoverPreview(`${BASE_URL}${book.coverImage}`);
      }
    }
  }, [book]);

  // 🔥 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Cover preview
  const handleCoverChange = (file) => {
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // 🔥 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setSubmitting(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => formData.append(key, form[key]));

      if (coverImage) formData.append("coverImage", coverImage);
      if (bookFile) formData.append("bookFile", bookFile);

      if (book) {
        await updateBook(book._id, formData);
      } else {
        await addBook(formData);
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
        {/* Header */}
        <h2 className="text-2xl font-semibold mb-4">
          {book ? "Edit Book" : "Add New Book"}
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Book Title"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />

            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Author"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            >
              {categories.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="totalCopies"
              value={form.totalCopies}
              onChange={handleChange}
              placeholder="Copies"
              className="border rounded-lg px-3 py-2"
            />
          </div>

          {/* Description */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded-lg px-3 py-2"
            rows="3"
          />

          {/* Book Type */}
          <select
            name="bookType"
            value={form.bookType}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
            <option value="both">Both</option>
          </select>

          {/* Upload Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Cover Upload */}
            <div
              onClick={() => document.getElementById("coverInput").click()}
              className="border-2 border-dashed rounded-lg h-36 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition overflow-hidden"
            >
              {coverPreview ? (
                <img src={coverPreview} className="h-full object-cover" />
              ) : (
                <>
                  <p className="text-gray-400">Upload Cover</p>
                  <span className="text-xs text-gray-300">JPG / PNG</span>
                </>
              )}

              <input
                id="coverInput"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleCoverChange(e.target.files[0])}
              />
            </div>

            {/* PDF Upload */}
            {(form.bookType === "digital" || form.bookType === "both") && (
              <div
                onClick={() => document.getElementById("pdfInput").click()}
                className="border-2 border-dashed rounded-lg h-36 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition"
              >
                {bookFile ? (
                  <p className="text-sm">{bookFile.name}</p>
                ) : book?.pdfUrl ? (
                  <p className="text-blue-500 text-sm">PDF Already Uploaded</p>
                ) : (
                  <>
                    <p className="text-gray-400">Upload PDF</p>
                    <span className="text-xs text-gray-300">Only PDF</span>
                  </>
                )}

                <input
                  id="pdfInput"
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={(e) => setBookFile(e.target.files[0])}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {submitting ? "Saving..." : "Save Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
