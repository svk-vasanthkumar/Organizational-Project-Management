const express = require("express");

const router = express.Router();

const {
    getProjectSummary,
    getMemberPerformance,
    getLagAttribution
} = require("../controllers/reportController");

router.get("/project-summary", getProjectSummary);

router.get("/member-performance", getMemberPerformance);

router.get("/lag-attribution", getLagAttribution);

module.exports = router;