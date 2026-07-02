const ClosureSnapshot = require("../models/ClosureSnapshot");

const createClosureSnapshot = async (req, res) => {

    try {

        const snapshot = await ClosureSnapshot.create(req.body);

        res.status(201).json({
            success: true,
            data: snapshot
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getClosureSnapshots = async (req, res) => {

    try {

        const snapshots = await ClosureSnapshot
            .find()
            .populate("projectId");

        res.json({
            success: true,
            data: snapshots
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createClosureSnapshot,
    getClosureSnapshots
};