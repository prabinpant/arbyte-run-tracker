import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import User from '../models/User';
import { syncUserActivities } from '../services/strava.service';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const stravaStrategy = new OAuth2Strategy({
    authorizationURL: 'https://www.strava.com/oauth/authorize',
    tokenURL: 'https://www.strava.com/oauth/token',
    clientID: process.env.STRAVA_CLIENT_ID || '',
    clientSecret: process.env.STRAVA_CLIENT_SECRET || '',
    callbackURL: process.env.STRAVA_REDIRECT_URI || '',
    passReqToCallback: true
  },
  async (req: any, accessToken: string, refreshToken: string, params: any, profile: any, done: any) => {
    try {
      // Strava returns the athlete object directly in the token response parameters
      const athlete = params.athlete;
      
      if (!athlete) {
        return done(new Error('No athlete data received in token exchange'), null);
      }

      const stravaId = athlete.id.toString();
      let user = await User.findOne({ stravaId });

      if (!user) {
        user = await User.create({
          stravaId,
          firstName: athlete.firstname || 'Athlete',
          lastName: athlete.lastname || '',
          profileEmoji: '🏃', // Default emoji
          totalDistance: 0,
          totalPace: 0,
          activityCount: 0,
          totalMovingTime: 0,
          accessToken,
          refreshToken,
          expiresAt: params.expires_at 
        });
      } else {
        // Update tokens and user details
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        user.expiresAt = params.expires_at;
        await user.save();
      }

      // Trigger immediate sync on login so the user sees fresh data
      try {
        await syncUserActivities(user._id.toString());
      } catch (syncErr) {
        console.error(`Initial sync failed for user ${user.firstName}:`, syncErr);
        // We don't fail the login if sync fails, user can still access dashboard
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
);

// We name it 'strava' so our auth routes continue to work without modification
passport.use('strava', stravaStrategy);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
