const bookModel = require("../Models/book");

const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      description,
      totalCopies,
      bookType,
      coverImage,
    } = req.body;

    let pdfUrl = null;
    if (req.file) {
      pdfUrl = `/uploads/books/${req.file.filename}`;
    }

    const availableCopies = bookType === "digital" ? 0 : totalCopies;

    const book = new bookModel({
      title,
      author,
      category,
      description,
      totalCopies,
      availableCopies,
      pdfUrl,
      coverImage,
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
