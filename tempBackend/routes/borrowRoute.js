const express = require("express");
const router = express.Router();

const protectRoute = require("../Middleware/AuthMiddleware");
const protectAdminRoute = require("../Middleware/AdminMiddleware");

const {
  requestBook,
  approveRequest,
  rejectRequest, // 🔥 add this
  returnBook,
  getDashboard,
  getAdminStats,
  getAllBorrows,
} = require("../controllers/borrowController");

// ================= STUDENT =================
router.post("/request", protectRoute, requestBook);
router.get("/dashboard", protectRoute, getDashboard);
router.put("/return/:id", protectRoute, returnBook);

// ================= ADMIN =================
router.get("/admin/stats", protectAdminRoute, getAdminStats);

router.get("/admin/borrows", protectAdminRoute, getAllBorrows);

router.put("/admin/approve/:id", protectAdminRoute, approveRequest);

// 🔥 NEW
router.put("/admin/reject/:id", protectAdminRoute, rejectRequest);

module.exports = router;
