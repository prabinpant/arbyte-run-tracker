import { Request, Response } from 'express';
import Activity from '../models/Activity';
import User from '../models/User';
import { LeaderboardEntry } from '../../../shared';

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
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
    const entries: LeaderboardEntry[] = await Promise.all(stats.map(async (stat, index) => {
      const user = await User.findById(stat._id);
      const totalPace = stat.totalDistance > 0 
        ? Math.round(stat.totalMovingTime / (stat.totalDistance / 1000)) 
        : 0;

      return {
        id: stat._id.toString(),
        stravaId: user?.stravaId || '',
        firstName: user?.firstName || 'Athlete',
        lastName: user?.lastName || '',
        profileEmoji: user?.profileEmoji || '🏃',
        totalDistance: stat.totalDistance,
        totalPace,
        activityCount: stat.activityCount,
        lastSyncedAt: user?.lastSyncedAt || new Date(),
        rank: index + 1
      };
    }));

    res.json({ leaderboard: entries });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
