const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../Models/user");

router.get("/profile", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
