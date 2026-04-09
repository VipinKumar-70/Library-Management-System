const Borrow = require("../Models/Borrow");
const Book = require("../Models/book");

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get user borrow history
    const history = await Borrow.find({
      user: userId,
      status: "approved",
    }).populate("book");

    // 👉 NEW USER → show trending
    if (history.length === 0) {
      const trending = await Book.find().sort({ issuedCount: -1 }).limit(6);

      return res.json({
        type: "trending",
        data: trending,
      });
    }

    // 2. Extract categories & tags
    const categories = history.map((h) => h.book.category);
    const tags = history.flatMap((h) => h.book.tags || []);
    const readBookIds = history.map((h) => h.book._id);

    // 3. Find similar books
    const recommended = await Book.find({
      _id: { $nin: readBookIds }, // ❌ exclude already read
      $or: [{ category: { $in: categories } }, { tags: { $in: tags } }],
    })
      .sort({ issuedCount: -1 }) // 🔥 priority to popular
      .limit(8);

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
