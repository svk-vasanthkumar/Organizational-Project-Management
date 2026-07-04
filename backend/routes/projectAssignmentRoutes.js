const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createAssignment,
  getAssignments,
  getAssignmentsByProject, // Imported explicitly
  updateAssignment,
  deleteAssignment,
} = require("../controllers/projectAssignmentController");

router.post("/", authMiddleware,  createAssignment);
router.get("/", authMiddleware,  getAssignments);
router.get("/project/:projectId", authMiddleware,  getAssignmentsByProject); // Mounted parametric filtering route
router.put("/:id", authMiddleware,  updateAssignment);
router.delete("/:id", authMiddleware,  deleteAssignment);

module.exports = router;