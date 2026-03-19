const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/adminAuth");

router.get("/register", register); // after creating admin delete this route in production

router.post("/login", login);

router.post("/logout", logout);

module.exports = router;
