const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createTimeLog,
  getTimeLogs,
} = require("../controllers/timeLogController");

router.post("/", authMiddleware, createTimeLog);
router.get("/", authMiddleware,  getTimeLogs);

module.exports = router;