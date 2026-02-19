const express = require("express");
const router = express.Router();
const userModel = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { username, course, enrollment, school, email, password } = req.body;

  const existingUser = await userModel.findOne({
    $or: [{ email }, { enrollment }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "user already exists",
    });
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      const createUser = await userModel.create({
        username,
        course,
        enrollment,
        school,
        email,
        password: hash,
      });

      console.log(createUser);
    });
  });

  res.json({
    success: true,
    message: "Register route working",
  });
});

module.exports = router;
