const express = require("express");
const router = express.Router();

const {
    getBreachLogs,
} = require("../controllers/breachLogController");

// Automatic Breach Logs
router.get("/", getBreachLogs);

module.exports = router;