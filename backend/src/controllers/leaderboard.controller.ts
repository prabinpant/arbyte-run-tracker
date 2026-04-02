import { Request, Response } from 'express';
import Activity from '../models/Activity';
import User from '../models/User';
import { LeaderboardEntry } from '../../../shared';
import asyncHandler from '../utils/asyncHandler';
import AppError from '../utils/AppError';

export const getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
  const AprilStart = new Date('2026-04-01T00:00:00Z');
  const AprilEnd = new Date('2026-04-30T23:59:59Z');

  // Aggregate activity distances per user
  const stats = await Activity.aggregate([
    {
      $match: {
        startDate: { $gte: AprilStart, $lte: AprilEnd },
        type: { $in: ['Run', 'Walk', 'Hike'] }
      }
    },
    {
      $group: {
        _id: '$userId',
        totalDistance: { $sum: '$distance' },
        activityCount: { $count: {} },
        totalMovingTime: { $sum: '$movingTime' }
      }
    },
    { $sort: { totalDistance: -1 } }
  ]);

  // Populate user info
  const usersPromises = stats.map(async (stat) => {
    const user = await User.findById(stat._id);
    const totalPace = stat.totalDistance > 0 
      ? Math.round(stat.totalMovingTime / (stat.totalDistance / 1000)) 
      : 0;
    
    return {
      ...user?.toObject(),
      _id: stat._id,
      totalDistance: stat.totalDistance,
      activityCount: stat.activityCount,
      totalMovingTime: stat.totalMovingTime,
      totalPace
    };
  });

  const users = await Promise.all(usersPromises);

  const leaderboard: LeaderboardEntry[] = users.map((user) => {
    return {
      userId: user._id.toString(),
      firstName: user.firstName || 'Athlete',
      lastName: user.lastName || '',
      profileEmoji: user.profileEmoji || '🏃',
      bio: user.bio,
      totalDistance: user.totalDistance || 0,
      totalActivities: user.activityCount || 0,
      avgPace: user.totalPace || 0,
      totalMovingTime: user.totalMovingTime || 0
    };
  });

  res.json(leaderboard);
});
