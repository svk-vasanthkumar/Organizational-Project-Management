const express = require("express");

const router = express.Router();

const {
    createBreachLog,
    getBreachLogs
} = require("../controllers/breachLogController");

router.get("/", getBreachLogs);

router.post("/", createBreachLog);

module.exports = router;