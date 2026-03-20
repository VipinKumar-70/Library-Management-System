const bookModel = require("../Models/book");

const addBook = async (req, res) => {
  try {
    const { title, author, category, description, totalCopies, bookType } =
      req.body;

    if (!title || !author || !category || !description) {
      return res.status(400).json({ message: "All fields required" });
    }

    const total = totalCopies || 0;
    const availableCopies = bookType === "digital" ? 0 : total;

    if (bookType === "digital" || bookType === "both") {
      if (!req.files?.bookFile) {
        return res
          .status(400)
          .json({ message: "PDF required for digital books" });
      }
    }

    let pdfUrl = null;
    let coverImageUrl = null;
    // PDF path
    if (req.files?.bookFile) {
      pdfUrl = `/uploads/books/${req.files.bookFile[0].filename}`;
    }

    // IMAGE path
    if (req.files?.coverImage) {
      coverImageUrl = `/uploads/bookCover/${req.files.coverImage[0].filename}`;
    }

    const book = new bookModel({
      title,
      author,
      category,
      description,
      totalCopies: total,
      availableCopies,
      pdfUrl,
      coverImage: coverImageUrl,
      bookType,
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

module.exports = { addBook };
