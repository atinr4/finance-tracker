import { Request, Response } from 'express';
import { Investment } from '../models/Investment';

export const createInvestment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const investment = new Investment({
      ...req.body,
      user: req.user._id,
    });

    await investment.save();
    return res.status(201).json(investment);
  } catch (error) {
    return res.status(400).json({ error: 'Error creating investment' });
  }
};

export const getInvestments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { category, startDate, endDate } = req.query;
    const query: any = { user: req.user._id };

    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const investments = await Investment.find(query)
      .sort({ date: -1 })
      .limit(100);

    return res.json(investments);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching investments' });
  }
};

export const updateInvestment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const investment = await Investment.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    return res.json(investment);
  } catch (error) {
    return res.status(400).json({ error: 'Error updating investment' });
  }
};

export const deleteInvestment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    return res.json({ message: 'Investment deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting investment' });
  }
};

export const getInvestmentStats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const stats = await Investment.aggregate([
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
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching investment stats' });
  }
};
