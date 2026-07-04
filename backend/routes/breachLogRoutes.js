const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    getBreachLogs,
} = require("../controllers/breachLogController");

// Automatic Breach Logs
router.get("/", authMiddleware,  getBreachLogs);

module.exports = router;