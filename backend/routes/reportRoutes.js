const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    getProjectSummary,
    getMemberPerformance,
    getLagAttribution
} = require("../controllers/reportController");

router.get("/project-summary", authMiddleware,  getProjectSummary);

router.get("/member-performance", authMiddleware,  getMemberPerformance);

router.get("/lag-attribution", authMiddleware,  getLagAttribution);

module.exports = router;