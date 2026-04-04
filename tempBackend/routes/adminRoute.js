const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/adminAuth");
const userModel = require("../Models/User");
const protectAdminRoute = require("../Middleware/AdminMiddleware");
const Borrow = require("../Models/Borrow");

router.get("/register", register); // after creating admin delete this route in production

router.post("/login", login);

router.post("/logout", logout);

router.get("/students", protectAdminRoute, async (req, res) => {
  try {
    const students = await userModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 });

    const enrichedStudents = await Promise.all(
      students.map(async (student) => {
        const borrows = await Borrow.find({ user: student._id }).populate(
          "book",
        );

        return {
          ...student.toObject(),

          // 🔥 NEW DATA
          borrowCount: borrows.filter((b) => b.status === "approved").length,
          pendingCount: borrows.filter((b) => b.status === "pending").length,
          returnedCount: borrows.filter((b) => b.status === "returned").length,

          borrows, // 🔥 full borrow history (very important)
        };
      }),
    );

    res.status(200).json({
      success: true,
      totalStudents: enrichedStudents.length,
      students: enrichedStudents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= UPDATE STUDENT =================
router.put("/students/:id", protectAdminRoute, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedStudent = await userModel
      .findByIdAndUpdate(id, req.body, { new: true })
      .select("-password");

    res.status(200).json({
      success: true,
      student: updatedStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
});

// ================= DELETE STUDENT =================
router.delete("/students/:id", protectAdminRoute, async (req, res) => {
  try {
    const { id } = req.params;

    await userModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
