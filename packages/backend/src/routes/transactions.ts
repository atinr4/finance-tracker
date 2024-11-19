import express from 'express';
import { auth } from '../middleware/auth';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
} from '../controllers/transactionController';

const router = express.Router();

router.use(auth);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/stats', getTransactionStats);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
