const express = require("express");
const router = express.Router();

const {
    getClosureSnapshots,
} = require("../controllers/closureSnapshotController");

router.get("/", getClosureSnapshots);

module.exports = router;