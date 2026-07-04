const express = require("express");
const router = express.Router();

const {
  createTimeLog,
  getTimeLogs,
} = require("../controllers/timeLogController");

router.post("/", createTimeLog);
router.get("/", getTimeLogs);

module.exports = router;