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

const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;

    const skip = (page - 1) * limit;

    // ONLY physical books for admin table
    const query = { bookType: { $in: ["physical", "both"] } };

    const books = await bookModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await bookModel.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
};

const deleteBook = async (req, res) => {
  try {
    await bookModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

const updateBook = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // ✅ Cover Image
    if (req.files?.coverImage) {
      updateData.coverImage = `/uploads/bookCover/${req.files.coverImage[0].filename}`;
    }

    // ✅ PDF
    if (req.files?.bookFile) {
      updateData.pdfUrl = `/uploads/books/${req.files.bookFile[0].filename}`;
    }

    const updated = await bookModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

module.exports = { addBook, getBooks, deleteBook, updateBook };
