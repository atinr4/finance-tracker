import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';

export const createTransaction = async (req: Request, res: Response): Promise<Response> => {
  try {
    const transaction = new Transaction({
      ...req.body,
      user: req.user._id,
    });

    await transaction.save();
    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(400).json({ error: 'Error creating transaction' });
  }
};

export const getTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { type, startDate, endDate, category } = req.query;
    const query: any = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(100);

    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching transactions' });
  }
};

export const updateTransaction = async (req: Request, res: Response): Promise<Response> => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    return res.json(transaction);
  } catch (error) {
    return res.status(400).json({ error: 'Error updating transaction' });
  }
};

export const deleteTransaction = async (req: Request, res: Response): Promise<Response> => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    return res.json({ message: 'Transaction deleted' });
  } catch (error) {
    return res.status(400).json({ error: 'Error deleting transaction' });
  }
};

export const getTransactionStats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const stats = await Transaction.aggregate([
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
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching transaction stats' });
  }
};
