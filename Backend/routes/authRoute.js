const express = require("express");
const router = express.Router();
const userModel = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
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

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be 8+ chars with uppercase, number & symbol",
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
        res.json({
          success: true,
          message: "User Registered successfully.",
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETKEY);
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        });
        return res
          .status(200)
          .json({ success: true, message: "Login Successful." });
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, message: "Something went wrong." });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully " });
});

module.exports = router;
