const express = require("express");
const router = express.Router();
const uploadBooks = require("../Middleware/UploadBook");
const { addBook } = require("../controllers/BookController");

router.post("/upload", uploadBooks, addBook);

// router.get("/booklist", async (req, res) => {
//   try {
//     const books = await bookModel.find();
//     res.json(books);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

module.exports = router;
