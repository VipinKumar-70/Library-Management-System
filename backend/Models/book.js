const mongoose = require("mongoose");

const bookschema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // Physical library
    totalCopies: {
      type: Number,
      default: 0,
    },
    availableCopies: {
      type: Number,
      default: 0,
    },
    // Digital library
    pdfUrl: {
      type: String,
      default: null,
    },

    coverImage: {
      type: String,
      default: null,
    },
    // Book type
    bookType: {
      type: String,
      enum: ["physical", "digital", "both"],
      default: "physical",
    },
    issuedCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookschema);
