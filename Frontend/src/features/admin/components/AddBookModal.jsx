import React, { useState, useEffect } from "react";
import { useBook } from "../../../context/BookContext";

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
    category: "",
    description: "",
    totalCopies: 1,
    bookType: "physical",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (book) {
      setForm(book);
    }
  }, [book]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setSubmitting(true);

      if (book) {
        await updateBook(book._id, form);
      } else {
        const formData = new FormData();
        Object.keys(form).forEach((key) => formData.append(key, form[key]));
        formData.append("coverImage", coverImage);
        if (bookFile) formData.append("bookFile", bookFile);

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
              {categories.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
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

          {/* Row 3 */}
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
            {["physical", "digital", "both"].map((item, index) => {
              return (
                <option key={index} value={item}>
                  {item}
                </option>
              );
            })}
          </select>

          {/* Upload Section */}
          {!book && (
            <div className="grid grid-cols-2 gap-4">
              {/* Cover Upload */}
              <div
                onClick={() => document.getElementById("coverInput").click()}
                className="border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition"
              >
                {coverImage ? (
                  <p className="text-sm">{coverImage.name}</p>
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
                  onChange={(e) => setCoverImage(e.target.files[0])}
                />
              </div>

              {/* PDF Upload */}
              {(form.bookType === "digital" || form.bookType === "both") && (
                <div
                  onClick={() => document.getElementById("pdfInput").click()}
                  className="border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition"
                >
                  {bookFile ? (
                    <p className="text-sm">{bookFile.name}</p>
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
                    onChange={(e) => setBookFile(e.target.files[0])}
                  />
                </div>
              )}
            </div>
          )}

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
