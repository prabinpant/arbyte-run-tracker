import cron from 'node-cron';
import User from '../models/User';
import { syncUserActivities } from './strava.service';

export const initCronJobs = () => {
  // Sync all users every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('--- Starting Global Sync ---');
    try {
      const users = await User.find({ refreshToken: { $exists: true } });
      console.log(`Syncing ${users.length} users...`);

      for (const user of users) {
        try {
          await syncUserActivities(user._id.toString());
          console.log(`Synced user ${user.firstName}`);
        } catch (err) {
          console.error(`Failed to sync user ${user.firstName}:`, err);
        }
      }
      console.log('--- Global Sync Complete ---');
    } catch (err) {
      console.error('Error fetching users for sync:', err);
    }
  });
};
