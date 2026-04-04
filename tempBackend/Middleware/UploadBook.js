const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  // where file goes / what name it gets
  destination: function (req, file, cb) {
    if (file.fieldname === "bookFile") {
      cb(null, "./public/uploads/books");
    } else if (file.fieldname === "coverImage") {
      cb(null, "./public/uploads/bookCover");
    }
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, (err, bytes) => {
      // crypto for unique file name
      if (err) return cb(err);
      const fn = bytes.toString("hex") + path.extname(file.originalname); // path used to extract extension from original file
      cb(null, fn);
    });
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "bookFile") {
    if (file.mimetype === "application/pdf") {
      // minetype = check file name
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  } else if (file.fieldname === "coverImage") {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image allowed"), false);
    }
  }
};

const upload = multer({ storage, fileFilter }).fields([
  {
    name: "bookFile",
    maxCount: 1,
  },
  {
    name: "coverImage",
    maxCount: 1,
  },
]);

const uploadBooks = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = uploadBooks;
