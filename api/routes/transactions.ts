import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { TransactionModel } from '../models/transaction';
import { auth } from '../middleware/auth';

const transactionRouter = Router();

// Get all transactions
transactionRouter.get('/', auth, async (req, res) => {
  try {
    const transactions = await TransactionModel.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add transaction
transactionRouter.post(
  '/',
  [
    auth,
    body('description').notEmpty(),
    body('amount').isNumeric(),
    body('type').isIn(['income', 'expense']),
    body('category').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { description, amount, type, category, date } = req.body;

      const transaction = new TransactionModel({
        user: req.user.id,
        description,
        amount,
        type,
        category,
        date: date || new Date(),
      });

      await transaction.save();
      res.json(transaction);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete transaction
transactionRouter.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default transactionRouter;
