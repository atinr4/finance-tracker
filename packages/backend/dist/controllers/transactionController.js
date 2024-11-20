"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionStats = exports.deleteTransaction = exports.updateTransaction = exports.getTransactions = exports.createTransaction = void 0;
const Transaction_1 = require("../models/Transaction");
const createTransaction = async (req, res) => {
    try {
        const transaction = new Transaction_1.Transaction({
            ...req.body,
            user: req.user._id,
        });
        await transaction.save();
        return res.status(201).json(transaction);
    }
    catch (error) {
        return res.status(400).json({ error: 'Error creating transaction' });
    }
};
exports.createTransaction = createTransaction;
const getTransactions = async (req, res) => {
    try {
        const { type, startDate, endDate, category } = req.query;
        const query = { user: req.user._id };
        if (type)
            query.type = type;
        if (category)
            query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate)
                query.date.$lte = new Date(endDate);
        }
        const transactions = await Transaction_1.Transaction.find(query)
            .sort({ date: -1 })
            .limit(100);
        return res.json(transactions);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching transactions' });
    }
};
exports.getTransactions = getTransactions;
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction_1.Transaction.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        return res.json(transaction);
    }
    catch (error) {
        return res.status(400).json({ error: 'Error updating transaction' });
    }
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction_1.Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        return res.json({ message: 'Transaction deleted' });
    }
    catch (error) {
        return res.status(400).json({ error: 'Error deleting transaction' });
    }
};
exports.deleteTransaction = deleteTransaction;
const getTransactionStats = async (req, res) => {
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
        const stats = await Transaction_1.Transaction.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
        ]);
        return res.json(stats);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching transaction stats' });
    }
};
exports.getTransactionStats = getTransactionStats;
//# sourceMappingURL=transactionController.js.map