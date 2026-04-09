const express = require("express");
const router = express.Router();

const protectRoute = require("../Middleware/AuthMiddleware");
const { getRecommendations } = require("../controllers/recommendController");

router.get("/", protectRoute, getRecommendations);

module.exports = router;
