const express = require("express");
const router = express.Router();

const {
  createTimeLog,
  getTimeLogs,
  updateTimeLog,
  deleteTimeLog,
} = require("../controllers/timeLogController");

// Create
router.post("/", createTimeLog);

// Get All
router.get("/", getTimeLogs);

// Update
router.put("/:id", updateTimeLog);

// Delete
router.delete("/:id", deleteTimeLog);

module.exports = router;