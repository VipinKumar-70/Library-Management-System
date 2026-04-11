const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/analyticsController");
const protectAdminRoute = require("../Middleware/AdminMiddleware");

router.get("/", protectAdminRoute, getAnalytics);

module.exports = router;
