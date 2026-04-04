import { Request, Response } from 'express';
import Activity from '../models/Activity';
import User from '../models/User';
import { LeaderboardEntry } from '../types/index';
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

  // Populate user info efficiently
  const userIds = stats.map(s => s._id);
  const usersFound = await User.find({ _id: { $in: userIds } }).lean();
  
  // Create a map for quick access
  const userMap = new Map(usersFound.map(u => [u._id.toString(), u]));

  const leaderboardData = stats.map((stat) => {
    const user = userMap.get(stat._id.toString());
    const totalPace = stat.totalDistance > 0 
      ? Math.round(stat.totalMovingTime / (stat.totalDistance / 1000)) 
      : 0;
    
    return {
      userId: stat._id.toString(),
      firstName: user?.firstName || 'Athlete',
      lastName: user?.lastName || '',
      profileEmoji: user?.profileEmoji || '🏃',
      bio: user?.bio || '',
      totalDistance: stat.totalDistance,
      totalActivities: stat.activityCount,
      avgPace: totalPace,
      totalMovingTime: stat.totalMovingTime
    };
  });

  res.json({ leaderboard: leaderboardData });
});
