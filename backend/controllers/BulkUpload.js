const bookModel = require("../Models/book");
const fs = require("fs");
const csv = require("csv-parser");

const bulkUploadBooks = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        if (!data.title || !data.author) return;

        results.push({
          title: data.title.trim(),
          author: data.author.trim(),
          category: data.category?.trim() || "General",
          description: data.description?.trim() || "No description",
          totalCopies: Number(data.totalCopies) || 0,
          availableCopies: Number(data.totalCopies) || 0,
          bookType: "physical", // safe
        });
      })
      .on("end", async () => {
        try {
          await bookModel.insertMany(results, { ordered: false });

          fs.unlinkSync(req.file.path);

          res.json({
            message: "Bulk upload successful",
            count: results.length,
          });
        } catch (err) {
          res.status(500).json({ message: "DB insert failed" });
        }
      })
      .on("error", () => {
        res.status(500).json({ message: "CSV parsing error" });
      });
  } catch (error) {
    res.status(500).json({ message: "Bulk upload failed" });
  }
};


module.exports = { bulkUploadBooks };