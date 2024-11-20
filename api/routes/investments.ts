import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { InvestmentModel } from '../models/investment';
import { auth } from '../middleware/auth';

const router = Router();

// Get all investments
router.get('/', auth, async (req, res) => {
  try {
    const investments = await InvestmentModel.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(investments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add investment
router.post(
  '/',
  [
    auth,
    body('name').notEmpty(),
    body('amount').isNumeric(),
    body('type').isIn(['stocks', 'bonds', 'mutual_funds', 'crypto', 'other']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, amount, type, description, date } = req.body;

      const investment = new InvestmentModel({
        user: req.user.id,
        name,
        amount,
        type,
        description,
        date: date || new Date(),
      });

      await investment.save();
      res.json(investment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update investment
router.put('/:id', auth, async (req, res) => {
  try {
    const investment = await InvestmentModel.findById(req.params.id);
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    if (investment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, amount, type, description } = req.body;
    if (name) investment.name = name;
    if (amount) investment.amount = amount;
    if (type) investment.type = type;
    if (description) investment.description = description;

    await investment.save();
    res.json(investment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete investment
router.delete('/:id', auth, async (req, res) => {
  try {
    const investment = await InvestmentModel.findById(req.params.id);
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    if (investment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await investment.deleteOne();
    res.json({ message: 'Investment removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
