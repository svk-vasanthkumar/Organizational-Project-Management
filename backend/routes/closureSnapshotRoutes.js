const express = require("express");

const router = express.Router();

const {
    createClosureSnapshot,
    getClosureSnapshots
} = require("../controllers/closureSnapshotController");

router.get("/", getClosureSnapshots);

router.post("/", createClosureSnapshot);

module.exports = router;