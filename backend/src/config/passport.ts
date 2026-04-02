import passport from 'passport';
const StravaStrategy = require('passport-strava-oauth2').Strategy;
import User from '../models/User';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

passport.use(new StravaStrategy({
    clientID: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    callbackURL: process.env.STRAVA_REDIRECT_URI,
    passReqToCallback: true
  },
  async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      let user = await User.findOne({ stravaId: profile.id });

      if (!user) {
        user = await User.create({
          stravaId: profile.id,
          firstName: profile.name.givenName || 'Athlete',
          lastName: profile.name.familyName || '',
          profileEmoji: '🏃', // Default emoji
          totalDistance: 0,
          totalPace: 0,
          activityCount: 0,
          accessToken,
          refreshToken,
          expiresAt: profile.expires_at // Passport-strava-oauth2 might provide this
        });
      } else {
        // Update tokens
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
