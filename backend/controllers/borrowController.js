const Borrow = require("../Models/Borrow");
const Book = require("../Models/book");

// 📥 REQUEST BOOK
const requestBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const existing = await Borrow.findOne({
      user: req.user.id,
      book: bookId,
      status: { $in: ["pending", "approved"] },
    });

    if (existing) {
      return res.json({ message: "Already requested or borrowed" });
    }

    const request = await Borrow.create({
      user: req.user.id,
      book: bookId,
      status: "pending",
    });

    res.json({ message: "Request sent", request });
  } catch (err) {
    res.status(500).json({ message: "Request failed" });
  }
};

// ✅ APPROVE REQUEST (ADMIN)
const approveRequest = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id)
      .populate("book")
      .populate("user");

    if (!borrow) return res.status(404).json({ message: "Not found" });

    if (borrow.status !== "pending") {
      return res.json({ message: "Already processed" });
    }

    if (borrow.book.availableCopies <= 0) {
      return res.json({ message: "No copies available" });
    }

    // 🔻 reduce copy
    borrow.book.availableCopies -= 1;

    // ✅ ADD THIS
    borrow.book.issuedCount = (borrow.book.issuedCount || 0) + 1;

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

// ❌ REJECT REQUEST (NEW FEATURE)
const rejectRequest = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) return res.status(404).json({ message: "Not found" });

    if (borrow.status !== "pending") {
      return res.json({ message: "Already processed" });
    }

    borrow.status = "rejected";
    await borrow.save();

    res.json({ message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting" });
  }
};

// 🔄 RETURN BOOK
const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id).populate("book");

    if (!borrow) return res.status(404).json({ message: "Not found" });

    if (borrow.status !== "approved") {
      return res.json({ message: "Invalid return request" });
    }

    borrow.status = "returned";
    borrow.returnDate = new Date();

    const today = new Date();

    // 🔥 fine calculation
    if (today > borrow.dueDate) {
      const diffDays = Math.ceil(
        (today - borrow.dueDate) / (1000 * 60 * 60 * 24),
      );
      borrow.fine = diffDays * 10;
    }

    // 🔺 increase copy
    borrow.book.availableCopies += 1;
    await borrow.book.save();

    await borrow.save();

    res.json({ message: "Returned", borrow });
  } catch (err) {
    res.status(500).json({ message: "Return failed" });
  }
};

// 📊 STUDENT DASHBOARD
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const borrows = await Borrow.find({ user: userId }).populate("book");

    const pending = borrows.filter((b) => b.status === "pending").length;
    const approved = borrows.filter((b) => b.status === "approved").length;
    const returned = borrows.filter((b) => b.status === "returned").length;

    const overdueList = borrows.filter(
      (b) => b.status === "approved" && new Date() > b.dueDate,
    );

    const overdue = overdueList.length;

    const totalFine = overdueList.reduce((sum, b) => {
      const diffDays = Math.ceil(
        (new Date() - b.dueDate) / (1000 * 60 * 60 * 24),
      );
      return sum + diffDays * 10;
    }, 0);

    res.json({
      pending,
      approved,
      returned,
      overdue,
      totalFine,
      borrows,
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard error" });
  }
};

// 📊 ADMIN STATS
const getAdminStats = async (req, res) => {
  try {
    const totalRequests = await Borrow.countDocuments({ status: "pending" });
    const totalBorrowed = await Borrow.countDocuments({ status: "approved" });
    const totalReturned = await Borrow.countDocuments({ status: "returned" });
    const totalRejected = await Borrow.countDocuments({ status: "rejected" });

    res.json({
      totalRequests,
      totalBorrowed,
      totalReturned,
      totalRejected,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

// 📋 ALL BORROWS (ADMIN PANEL)
const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("user", "username email enrollment course school")
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(borrows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching borrows" });
  }
};

module.exports = {
  requestBook,
  approveRequest,
  rejectRequest, // 🔥 NEW
  returnBook,
  getDashboard,
  getAdminStats,
  getAllBorrows,
};
