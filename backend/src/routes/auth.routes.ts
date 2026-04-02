import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = Router();

// OAuth Strava routes
router.get('/strava', passport.authenticate('strava', { scope: ['read,activity:read_all'], session: false }));

router.get('/strava/callback', 
  passport.authenticate('strava', { failureRedirect: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/?error=strava_auth_failed`, session: false }),
  (req: any, res: any) => {
    // Generate Token
    const token = jwt.sign(
      { id: req.user._id }, 
      process.env.JWT_SECRET || 'arbyte-secret', 
      { expiresIn: '7d' }
    );
    
    // Successful authentication, redirect to frontend with token
    res.redirect(`${process.env.VITE_APP_URL || 'http://localhost:5173'}/?success=strava_auth_success&token=${token}`);
  }
);

router.get('/me', isAuthenticated, (req: any, res) => {
  res.json(req.user);
});

router.post('/logout', isAuthenticated, (req: any, res) => {
  res.status(200).json({ message: 'Logged out' });
});

export default router;
