const express = require("express");
const router = express.Router();

const {
    getPerformance
} = require("../controllers/performanceController");

// Get performance analytics metrics aggregated for all team members
router.get("/", getPerformance);

module.exports = router;