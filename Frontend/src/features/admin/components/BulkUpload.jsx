import React, { useState } from "react";
import { bulkUploadBooksApi } from "../../../api/index";

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a CSV file");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await bulkUploadBooksApi(file);

      setMessage(`✅ ${res.message} (${res.count} books added)`);
      setFile(null);
    } catch (err) {
      setMessage("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.includes("csv")) {
      setFile(droppedFile);
    } else {
      setMessage("❌ Only CSV files allowed");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          📂 Bulk Upload Books
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload multiple books using CSV file
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
          dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
        }`}
      >
        <p className="text-gray-600">Drag & drop your CSV file here or</p>

        <label className="block mt-2 cursor-pointer text-indigo-600 font-medium hover:underline">
          Browse File
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
      </div>

      {/* File Preview */}
      {file && (
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
          <div className="text-sm text-gray-700 truncate">📄 {file.name}</div>

          <button
            onClick={() => setFile(null)}
            className="text-red-500 text-sm hover:underline"
          >
            Remove
          </button>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
        }`}
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>

      {/* Message */}
      {message && (
        <div className="text-sm text-center text-gray-700">{message}</div>
      )}
    </div>
  );
};

export default BulkUpload;
