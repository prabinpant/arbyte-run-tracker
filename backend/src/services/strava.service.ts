import axios from 'axios';
import User from '../models/User';
import Activity from '../models/Activity';

const STRAVA_API_URL = 'https://www.strava.com/api/v3';

export const refreshUserToken = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || !user.refreshToken) return;

  console.log(`Refreshing token for user ${user.firstName}...`);
  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: user.refreshToken
    });

    const { access_token, refresh_token, expires_at } = response.data;
    
    user.accessToken = access_token;
    if (refresh_token) user.refreshToken = refresh_token;
    user.expiresAt = expires_at;
    await user.save();
    
    return access_token;
  } catch (err: any) {
    console.error(`Token refresh failed for user ${userId}:`, err.response?.data || err.message);
    throw err;
  }
};

export const syncUserActivities = async (userId: string) => {
  let user = await User.findById(userId);
  if (!user || !user.accessToken) return;

  // Refresh token if expired or expiring soon (within 10 minutes)
  const tenMinutesInSeconds = 600;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  
  if (user.expiresAt && nowInSeconds > (user.expiresAt - tenMinutesInSeconds)) {
    try {
      const newAccessToken = await refreshUserToken(userId);
      if (newAccessToken) {
        // Re-fetch user to get the updated accessToken if needed, 
        // but refreshUserToken updates the DB. We just need the new token for the current sync.
        user.accessToken = newAccessToken;
      }
    } catch (err) {
      console.warn(`Sync proceeding with potentially expired token for ${userId}`);
    }
  }

  try {
    const AprilStart = Math.floor(new Date('2026-04-01T00:00:00Z').getTime() / 1000);
    const AprilEnd = Math.floor(new Date('2026-04-30T23:59:59Z').getTime() / 1000);

    const response = await axios.get(`${STRAVA_API_URL}/athlete/activities`, {
      params: {
        after: AprilStart,
        before: AprilEnd,
        per_page: 100
      },
      headers: { Authorization: `Bearer ${user.accessToken}` }
    });

    const activities = response.data;
    let newDistance = 0;
    let activityCount = 0;
    let totalMovingTime = 0;

    for (const raw of activities) {
      if (['Run', 'Walk', 'Hike'].includes(raw.type)) {
        await Activity.findOneAndUpdate(
          { stravaId: raw.id.toString() },
          {
            stravaId: raw.id.toString(),
            userId: user._id,
            name: raw.name,
            distance: raw.distance,
            movingTime: raw.moving_time,
            elapsedTime: raw.elapsed_time,
            type: raw.type,
            startDate: new Date(raw.start_date),
            startLatLng: raw.start_latlng,
            polyline: raw.map?.summary_polyline
          },
          { upsert: true, new: true }
        );

        newDistance += raw.distance;
        activityCount++;
        totalMovingTime += raw.moving_time;
      }
    }

    user.totalDistance = newDistance;
    user.activityCount = activityCount;
    user.totalPace = newDistance > 0 ? Math.round(totalMovingTime / (newDistance / 1000)) : 0;
    user.lastSyncedAt = new Date();
    await user.save();

    return { activityCount, newDistance };
  } catch (err: any) {
    console.error(`Sync error for user ${userId}:`, err.response?.data || err.message);
    throw err;
  }
};
