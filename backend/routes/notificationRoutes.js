const express = require("express");
const router = express.Router();
const { getNotifications, markAllRead } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getNotifications);
router.put("/mark-all-read", protect, markAllRead);

module.exports = router;
