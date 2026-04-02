import { Router } from 'express';
import passport from 'passport';

const router = Router();

// OAuth Strava routes
router.get('/strava', passport.authenticate('strava', { scope: ['read,activity:read_all'] }));

router.get('/strava/callback', 
  passport.authenticate('strava', { failureRedirect: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/?error=strava_auth_failed` }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect(`${process.env.VITE_APP_URL || 'http://localhost:5173'}/?success=strava_auth_success`);
  }
);

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

router.post('/logout', (req: any, res, next) => {
  req.logout((err: any) => {
    if (err) return next(err);
    res.status(200).json({ message: 'Logged out' });
  });
});

export default router;
