import React, { useState } from "react";
import { useBook } from "../../../context/BookContext";

export default function AddBookModal({ onClose }) {
  const { addBook } = useBook();
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
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.title || !form.author || !form.category || !form.description) {
      setError("Please fill all required fields.");
      return;
    }
    if (
      (form.bookType === "digital" || form.bookType === "both") &&
      !bookFile
    ) {
      setError("PDF file is required for digital books.");
      return;
    }
    if (!coverImage) {
      setError("Cover image is required.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      formData.append("coverImage", coverImage);
      if (bookFile) formData.append("bookFile", bookFile);

      await addBook(formData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/30 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
        {error && <p className="mb-2 text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Book Title"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={submitting}
          />

          {/* Author */}
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Author Name"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={submitting}
          />

          {/* Category */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={submitting}
          >
            <option value="">Select Category</option>
            <option value="fiction">Fiction</option>
            <option value="nonfiction">Non-fiction</option>
            <option value="science">Science</option>
            <option value="history">History</option>
            <option value="biography">Biography</option>
          </select>

          {/* Description */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Book Description"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
            required
            disabled={submitting}
          />

          {/* Total Copies */}
          <input
            type="number"
            name="totalCopies"
            min="1"
            value={form.totalCopies}
            onChange={handleChange}
            placeholder="Total Copies"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={submitting}
          />

          {/* Book Type */}
          <select
            name="bookType"
            value={form.bookType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={submitting}
          >
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
            <option value="both">Both</option>
          </select>

          {/* Modern Upload Boxes */}
          <div className="flex gap-4">
            {/* Cover Image */}
            <div className="flex-1">
              <label className="block mb-1 font-medium">Cover Image</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded h-28 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition"
                onClick={() => document.getElementById("coverInput").click()}
              >
                {coverImage ? (
                  <span>{coverImage.name}</span>
                ) : (
                  <span className="text-gray-400">Click or drag file</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                id="coverInput"
                className="hidden"
                onChange={(e) => setCoverImage(e.target.files[0])}
                disabled={submitting}
              />
            </div>

            {/* PDF File */}
            {(form.bookType === "digital" || form.bookType === "both") && (
              <div className="flex-1">
                <label className="block mb-1 font-medium">PDF File</label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded h-28 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition"
                  onClick={() => document.getElementById("pdfInput").click()}
                >
                  {bookFile ? (
                    <span>{bookFile.name}</span>
                  ) : (
                    <span className="text-gray-400">Click or drag file</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  id="pdfInput"
                  className="hidden"
                  onChange={(e) => setBookFile(e.target.files[0])}
                  disabled={submitting}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
