const Borrow = require("../Models/Borrow");
const Book = require("../Models/book");

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await Borrow.find({
      user: userId,
      status: "approved",
    }).populate("book");

    // ✅ remove deleted books
    const validHistory = history.filter((h) => h.book);

    // 👉 NEW USER → trending
    if (validHistory.length === 0) {
      const trending = await Book.find().sort({ issuedCount: -1 }).limit(6);

      return res.json({
        type: "trending",
        data: trending,
      });
    }

    // ✅ safe extraction
    const categories = validHistory.map((h) => h.book.category);
    const tags = validHistory.flatMap((h) => h.book.tags || []);
    const readBookIds = validHistory.map((h) => h.book._id);

    // ✅ find recommendations
    let recommended = await Book.find({
      _id: { $nin: readBookIds },
      $or: [{ category: { $in: categories } }, { tags: { $in: tags } }],
    })
      .sort({ issuedCount: -1 })
      .limit(6);

    // ✅ fallback if empty
    if (recommended.length === 0) {
      recommended = await Book.find({
        _id: { $nin: readBookIds },
      })
        .sort({ createdAt: -1 })
        .limit(6);
    }

    res.json({
      type: "personalized",
      data: recommended,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Recommendation error" });
  }
};

module.exports = { getRecommendations };
