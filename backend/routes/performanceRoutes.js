const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    getPerformance
} = require("../controllers/performanceController");

// Get performance analytics metrics aggregated for all team members
router.get("/", authMiddleware, getPerformance);

module.exports = router;