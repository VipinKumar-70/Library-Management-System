const express = require("express");
const router = express.Router();
const uploadBooks = require("../Middleware/UploadBook");
const { addBook } = require("../controllers/BookController");

router.post("/upload", uploadBooks, addBook);

module.exports = router;
