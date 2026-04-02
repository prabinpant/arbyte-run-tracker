import { Router } from 'express';

const router = Router();

// Leaderboard routes
router.get('/', (req, res) => res.json({ leaderboard: [] }));

export default router;
