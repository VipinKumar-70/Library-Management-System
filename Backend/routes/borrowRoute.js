const express = require("express");
const router = express.Router();
const protectRoute = require("../Middleware/AuthMiddleware");

const {
  requestBook,
  approveRequest,
  returnBook,
  getDashboard,
  getAdminStats,
  getAllBorrows,
} = require("../controllers/borrowController");

// student
router.post("/request", protectRoute, requestBook);
router.get("/dashboard", protectRoute, getDashboard);
router.put("/return/:id", protectRoute, returnBook);

// admin
router.get("/admin-stats", protectRoute, getAdminStats);
router.get("/all", protectRoute, getAllBorrows);
router.put("/approve/:id", protectRoute, approveRequest);

module.exports = router;
