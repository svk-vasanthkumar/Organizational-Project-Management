const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAssignments,
  getAssignmentsByProject, // Imported explicitly
  updateAssignment,
  deleteAssignment,
} = require("../controllers/projectAssignmentController");

router.post("/", createAssignment);
router.get("/", getAssignments);
router.get("/project/:projectId", getAssignmentsByProject); // Mounted parametric filtering route
router.put("/:id", updateAssignment);
router.delete("/:id", deleteAssignment);

module.exports = router;