import { Request, Response } from 'express';
import { ITransaction } from '../models/Transaction';
import { IInvestment } from '../models/Investment';
import mongoose from 'mongoose';

interface TransactionStat {
  _id: string;
  total: number;
}

interface InvestmentStat {
  _id: string | null;
  total: number;
}

interface InvestmentCategoryStat {
  category: string;
  total: number;
}

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const Transaction = mongoose.model<ITransaction>('Transaction');
    const Investment = mongoose.model<IInvestment>('Investment');

    // Get transactions summary
    const transactionStats = await Transaction.aggregate<TransactionStat>([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    const income = transactionStats.find((stat: TransactionStat) => stat._id === 'income')?.total || 0;
    const expense = transactionStats.find((stat: TransactionStat) => stat._id === 'expense')?.total || 0;

    // Get recent transactions
    const recentTransactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(5);

    // Get investments summary
    const investmentTotal = await Investment.aggregate<InvestmentStat>([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const investmentsByCategory = await Investment.aggregate<InvestmentCategoryStat>([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
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
        total: investmentTotal[0]?.total || 0,
        byCategory: investmentsByCategory
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Error fetching dashboard stats' });
  }
};
