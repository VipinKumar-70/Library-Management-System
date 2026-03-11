const express = require("express");
const router = express.Router();
const adminModel = require("../Models/Admin");
const protectAdminRoute = require("../Middleware/AdminMiddleware");

router.get("/profile", protectAdminRoute, async (req, res) => {
  try {
    const admin = await adminModel.findById(req.admin.id).select("-password");

    if (!admin) return res.status(401).json({ message: "Admin not found." });

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
