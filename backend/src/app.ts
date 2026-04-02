import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import passport from './config/passport';
import authRoutes from './routes/auth.routes';
import activityRoutes from './routes/activity.routes';
import leaderboardRoutes from './routes/leaderboard.routes';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Session and Passport
app.use(session({
  secret: process.env.JWT_SECRET || 'arbyte-secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

export default app;
