import express from 'express';
import { auth } from '../middleware/auth';
import {
  createInvestment,
  getInvestments,
  updateInvestment,
  deleteInvestment,
  getInvestmentStats,
} from '../controllers/investmentController';

const router = express.Router();

router.use(auth);

router.post('/', createInvestment);
router.get('/', getInvestments);
router.get('/stats', getInvestmentStats);
router.patch('/:id', updateInvestment);
router.delete('/:id', deleteInvestment);

export default router;
