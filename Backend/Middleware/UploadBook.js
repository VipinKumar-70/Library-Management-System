const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const uploadBooks = (req, res, next) => {
  try {
    const storage = multer.diskStorage({
      // where file goes / what name it gets
      destination: function (req, file, cb) {
        cb(null, "./public/uploads/books");
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
      if (file.mimetype === "application/pdf") {
        // minetype = check file name
        cb(null, true);
      } else {
        cb(new Error("Only PDF files are allowed"), false);
      }
    };

    const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
      // no direct upload but multer return promise
      "book",
    );

    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: "Upload failed" });
  }
};

module.exports = uploadBooks;
