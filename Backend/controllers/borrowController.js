const Borrow = require("../Models/Borrow");
const Book = require("../Models/book");

// 📥 Request Book
const requestBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const existing = await Borrow.findOne({
      user: req.user.id,
      book: bookId,
      status: { $in: ["pending", "approved"] },
    });

    if (existing) {
      return res.json({ message: "Already requested/borrowed" });
    }

    const request = await Borrow.create({
      user: req.user.id,
      book: bookId,
    });

    res.json({ message: "Request sent", request });
  } catch (err) {
    res.status(500).json({ message: "Request failed" });
  }
};

// ✅ Approve (Admin)
const approveRequest = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id).populate("book");

    if (!borrow) return res.status(404).json({ message: "Not found" });

    if (borrow.book.availableCopies <= 0) {
      return res.json({ message: "No copies available" });
    }

    borrow.book.availableCopies -= 1;
    await borrow.book.save();

    borrow.status = "approved";
    borrow.borrowDate = new Date();

    const due = new Date();
    due.setDate(due.getDate() + 7);
    borrow.dueDate = due;

    await borrow.save();

    res.json({ message: "Approved", borrow });
  } catch (err) {
    res.status(500).json({ message: "Error approving" });
  }
};

// 🔄 Return Book
const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id).populate("book");

    if (!borrow) return res.status(404).json({ message: "Not found" });

    borrow.status = "returned";
    borrow.returnDate = new Date();

    const today = new Date();
    if (today > borrow.dueDate) {
      const diffDays = Math.ceil(
        (today - borrow.dueDate) / (1000 * 60 * 60 * 24),
      );
      borrow.fine = diffDays * 10;
    }

    borrow.book.availableCopies += 1;
    await borrow.book.save();

    await borrow.save();

    res.json({ message: "Returned", borrow });
  } catch (err) {
    res.status(500).json({ message: "Return failed" });
  }
};

// 📊 Dashboard Data
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const borrows = await Borrow.find({ user: userId }).populate("book");

    const pending = borrows.filter((b) => b.status === "pending").length;
    const approved = borrows.filter((b) => b.status === "approved").length;
    const returned = borrows.filter((b) => b.status === "returned").length;

    const overdue = borrows.filter(
      (b) => b.status === "approved" && new Date() > b.dueDate,
    ).length;

    res.json({
      pending,
      approved,
      returned,
      overdue,
      borrows,
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard error" });
  }
};

// 📊 Admin Stats
const getAdminStats = async (req, res) => {
  try {
    const totalRequests = await Borrow.countDocuments({ status: "pending" });
    const totalBorrowed = await Borrow.countDocuments({ status: "approved" });

    res.json({
      totalRequests,
      totalBorrowed,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

// 📋 Get ALL borrow requests (for admin panel)
const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("user", "username email")
      .populate("book");

    res.json(borrows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching borrows" });
  }
};

module.exports = {
  requestBook,
  approveRequest,
  returnBook,
  getDashboard,
  getAdminStats,
  getAllBorrows,
};
