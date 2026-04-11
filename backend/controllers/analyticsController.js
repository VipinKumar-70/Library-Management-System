const Borrow = require("../Models/Borrow");
const Book = require("../Models/book");

const getAnalytics = async (req, res) => {
  try {
    // 1. Total stats
    const totalBooks = await Book.countDocuments();
    const totalBorrows = await Borrow.countDocuments({ status: "approved" });

    // 2. Category distribution
    const categoryStats = await Book.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // 3. Monthly borrow trends
    const monthlyBorrows = await Borrow.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: { month: { $month: "$borrowDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // 4. Top books
    const topBooks = await Book.find()
      .sort({ issuedCount: -1 })
      .limit(5);

    res.json({
      totalBooks,
      totalBorrows,
      categoryStats,
      monthlyBorrows,
      topBooks,
    });
  } catch (err) {
    res.status(500).json({ message: "Analytics error" });
  }
};

module.exports = { getAnalytics };