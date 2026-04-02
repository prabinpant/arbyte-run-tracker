import cron from 'node-cron';
import User from '../models/User';
import { syncUserActivities } from './strava.service';

export const initCronJobs = () => {
  // Sync all users every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    console.log('--- Starting Global Sync ---');
    try {
      const users = await User.find({ refreshToken: { $exists: true } });
      console.log(`Found ${users.length} authorized users.`);

      for (const user of users) {
        try {
          // Skip if synced in the last 9 minutes (avoids redundant calls if they just logged in)
          const nineMinutesAgo = new Date(Date.now() - 9 * 60 * 1000);
          if (user.lastSyncedAt && new Date(user.lastSyncedAt) > nineMinutesAgo) {
            console.log(`[Sync] Skipping ${user.firstName || 'Athlete'} (recently synced)`);
            continue;
          }

          console.log(`[Sync] Processing ${user.firstName || 'Athlete'}...`);
          await syncUserActivities(user._id.toString());
        } catch (err) {
          console.error(`[Sync] Failed for ${user.firstName || 'Athlete'}:`, err);
        }
      }
      console.log('--- Global Sync Complete ---');
    } catch (err) {
      console.error('Error fetching users for sync:', err);
    }
  });
};
