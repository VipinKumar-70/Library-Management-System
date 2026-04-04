const adminModel = require("../Models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  // its help creating user first time to mongoDB database
  const admin = {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  };
  try {
    const existingAdmin = await adminModel.findOne({ email: admin.email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(admin.password, salt, async function (err, hash) {
        const DefaultAdmin = await adminModel.create({
          email: admin.email,
          password: hash,
        });

        console.log(DefaultAdmin);
        res.json({
          success: true,
          message: "Admin Created successfully.",
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    bcrypt.compare(password, admin.password, function (err, result) {
      if (!result) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email or password" });
      }

      if (result) {
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRETKEY);
        res.cookie("adminToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
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
};

const logout = async (req, res) => {
  res.clearCookie("adminToken");
  res.json({ message: "Logged out successfully " });
};

module.exports = { register, login, logout };
