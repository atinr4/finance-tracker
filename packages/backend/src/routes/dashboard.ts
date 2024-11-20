import express from 'express';
import { auth } from '../middleware/auth';
import { getDashboardStats } from '../controllers/dashboardController';

const router = express.Router();

router.use(auth);
router.get('/stats', getDashboardStats);

export default router;
