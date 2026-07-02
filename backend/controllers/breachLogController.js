const BreachLog = require("../models/BreachLog");

const createBreachLog = async (req, res) => {

    try {

        const breach = await BreachLog.create(req.body);

        res.status(201).json({
            success: true,
            data: breach
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getBreachLogs = async (req, res) => {

    try {

        const logs = await BreachLog.find()
            .populate("taskId")
            .populate("memberId");

        res.json({
            success: true,
            count: logs.length,
            data: logs
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createBreachLog,
    getBreachLogs
};