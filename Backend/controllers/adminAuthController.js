const adminModel = require("../Models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

login = async (req, res) => {
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
};

logout = async (req, res) => {
  res.clearCookie("adminToken");
  res.json({ message: "Logged out successfully " });
};

module.exports = { login, logout };
