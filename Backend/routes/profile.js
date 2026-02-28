const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../Models/user");
const protecRoute = require("../Middleware/authmiddleware");

router.get("/profile", protecRoute, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) return res.status(401).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
