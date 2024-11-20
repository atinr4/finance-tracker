"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvestmentStats = exports.deleteInvestment = exports.updateInvestment = exports.getInvestments = exports.createInvestment = void 0;
const Investment_1 = require("../models/Investment");
const createInvestment = async (req, res) => {
    try {
        const investment = new Investment_1.Investment({
            ...req.body,
            user: req.user._id,
        });
        await investment.save();
        return res.status(201).json(investment);
    }
    catch (error) {
        return res.status(400).json({ error: 'Error creating investment' });
    }
};
exports.createInvestment = createInvestment;
const getInvestments = async (req, res) => {
    try {
        const { category, startDate, endDate } = req.query;
        const query = { user: req.user._id };
        if (category)
            query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate)
                query.date.$lte = new Date(endDate);
        }
        const investments = await Investment_1.Investment.find(query)
            .sort({ date: -1 })
            .limit(100);
        return res.json(investments);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching investments' });
    }
};
exports.getInvestments = getInvestments;
const updateInvestment = async (req, res) => {
    try {
        const investment = await Investment_1.Investment.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
        if (!investment) {
            return res.status(404).json({ error: 'Investment not found' });
        }
        return res.json(investment);
    }
    catch (error) {
        return res.status(400).json({ error: 'Error updating investment' });
    }
};
exports.updateInvestment = updateInvestment;
const deleteInvestment = async (req, res) => {
    try {
        const investment = await Investment_1.Investment.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!investment) {
            return res.status(404).json({ error: 'Investment not found' });
        }
        return res.json({ message: 'Investment deleted' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error deleting investment' });
    }
};
exports.deleteInvestment = deleteInvestment;
const getInvestmentStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { user: req.user._id };
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate)
                query.date.$lte = new Date(endDate);
        }
        const stats = await Investment_1.Investment.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
        ]);
        return res.json(stats);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching investment stats' });
    }
};
exports.getInvestmentStats = getInvestmentStats;
//# sourceMappingURL=investmentController.js.map