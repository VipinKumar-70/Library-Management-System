const express = require("express");
const router = express.Router();
const uploadBooks = require("../Middleware/UploadBook");
const {
  addBook,
  getBooks,
  deleteBook,
  updateBook,
} = require("../controllers/BookController");

router.post("/upload", uploadBooks, addBook);

router.get("/booklist", getBooks);

router.get("/booklist", getBooks);
router.delete("/:id", deleteBook);
router.put("/:id", updateBook);

module.exports = router;
