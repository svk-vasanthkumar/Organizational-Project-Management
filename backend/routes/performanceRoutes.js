const express = require("express");
const router = express.Router();

const {
    getPerformance
} = require("../controllers/performanceController");

router.get("/:memberId/:projectId", getPerformance);

module.exports = router;