# Arbyte Run Tracker Backend - Keep Alive Guide

Render's Free Tier automatically spins down services after 15 minutes of inactivity. To prevent this "restarting" behavior and keep your leaderboard snappy, follow these steps:

## Option 1: UptimeRobot (Recommended)
1. Go to [UptimeRobot.com](https://uptimerobot.com/) and create a free account.
2. Click **Add New Monitor**.
3. **Monitor Type**: HTTP(s)
4. **Friendly Name**: `Arbyte Backend`
5. **URL (or IP)**: `https://arbyte-run-tracker.onrender.com/health` (Replace with your actual Render URL)
6. **Monitoring Interval**: Every 5 or 10 minutes.
7. Click **Create Monitor**.

## Option 2: Cron-job.org
1. Go to [cron-job.org](https://cron-job.org/).
2. Create a new cron job.
3. **URL**: `https://arbyte-run-tracker.onrender.com/health`
4. **Schedule**: Every 14 minutes.
5. Save.

## Why this works
By hitting the `/health` endpoint every few minutes, you generate enough "activity" to prevent Render from putting the service to sleep. This ensures that the leaderboard loads instantly when a user visits the site.

---
*Note: If you continue to see restarts, check the Render logs for any "Out of Memory" (OOM) errors, as that would indicate a crash rather than a sleep.*
