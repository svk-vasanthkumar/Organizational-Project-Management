const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createTeamMember,
  getTeamMembers,
  deleteTeamMember,
} = require("../controllers/teamMemberController");

router.post("/", authMiddleware, createTeamMember);
router.get("/", authMiddleware,  getTeamMembers);
router.delete("/:id", authMiddleware, deleteTeamMember);


module.exports = router;