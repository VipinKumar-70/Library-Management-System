const express = require("express");
const router = express.Router();
const uploadBooks = require("../Middleware/UploadBook");
const {
  addBook,
  getBooks,
  deleteBook,
  updateBook,
} = require("../controllers/BookController");
const uploadCSV = require("../Middleware/uploadCSV");
const { bulkUploadBooks } = require("../controllers/BulkUpload");

router.post("/upload", uploadBooks, addBook);

router.get("/booklist", getBooks);

router.get("/booklist", getBooks);
router.delete("/:id", deleteBook);
router.put("/:id", uploadBooks, updateBook);

router.post("/bulk-upload", uploadCSV, bulkUploadBooks);

module.exports = router;
