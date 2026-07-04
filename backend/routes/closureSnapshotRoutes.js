const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    getClosureSnapshots,
} = require("../controllers/closureSnapshotController");

router.get("/", authMiddleware, getClosureSnapshots);

module.exports = router;