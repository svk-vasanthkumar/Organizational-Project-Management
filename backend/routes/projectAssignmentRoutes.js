const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAssignments,
} = require("../controllers/projectAssignmentController");

router.post("/", createAssignment);
router.get("/", getAssignments);

module.exports = router;