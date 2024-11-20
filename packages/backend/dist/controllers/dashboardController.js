"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const getDashboardStats = async (req, res) => {
    var _a, _b, _c;
    try {
        const Transaction = mongoose_1.default.model('Transaction');
        const Investment = mongoose_1.default.model('Investment');
        const transactionStats = await Transaction.aggregate([
            { $match: { user: new mongoose_1.default.Types.ObjectId(req.user._id) } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }
        ]);
        const income = ((_a = transactionStats.find((stat) => stat._id === 'income')) === null || _a === void 0 ? void 0 : _a.total) || 0;
        const expense = ((_b = transactionStats.find((stat) => stat._id === 'expense')) === null || _b === void 0 ? void 0 : _b.total) || 0;
        const recentTransactions = await Transaction.find({ user: req.user._id })
            .sort({ date: -1 })
            .limit(5);
        const investmentTotal = await Investment.aggregate([
            { $match: { user: new mongoose_1.default.Types.ObjectId(req.user._id) } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        const investmentsByCategory = await Investment.aggregate([
            { $match: { user: new mongoose_1.default.Types.ObjectId(req.user._id) } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    category: '$_id',
                    total: 1,
                    _id: 0
                }
            }
        ]);
        res.json({
            transactions: {
                income,
                expense,
                recent: recentTransactions
            },
            investments: {
                total: ((_c = investmentTotal[0]) === null || _c === void 0 ? void 0 : _c.total) || 0,
                byCategory: investmentsByCategory
            }
        });
    }
    catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Error fetching dashboard stats' });
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=dashboardController.js.map