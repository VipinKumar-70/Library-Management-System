const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
} = require("../controllers/adminAuthController");

router.get("/register", register);

router.post("/login", login);

router.post("/logout", logout);

module.exports = router;
