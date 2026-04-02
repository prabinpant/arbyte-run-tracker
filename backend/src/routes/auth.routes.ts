import { Router } from 'express';

const router = Router();

// OAuth Strava routes will be implemented in Phase 4
router.get('/strava', (req, res) => res.send('Strava Auth'));
router.get('/strava/callback', (req, res) => res.send('Strava Callback'));

export default router;
