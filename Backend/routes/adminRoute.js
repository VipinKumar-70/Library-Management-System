const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
} = require("../controllers/adminAuth");

router.get("/register", register);

router.post("/login", login);

router.post("/logout", logout);

module.exports = router;
