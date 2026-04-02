import { Request, Response } from 'express';
import User from '../models/User';
import Activity from '../models/Activity';

export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Fetch activities for April 2026
    const AprilStart = new Date('2026-04-01T00:00:00Z');
    const AprilEnd = new Date('2026-04-30T23:59:59Z');

    const activities = await Activity.find({
      userId,
      startDate: { $gte: AprilStart, $lte: AprilEnd }
    }).sort({ startDate: -1 });

    res.json(activities);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { bio } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { bio },
      { new: true }
    );

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
