export interface User {
  _id: string;
  stravaId: string;
  firstName: string;
  lastName: string;
  profileEmoji?: string;
  bio?: string;
  totalDistance: number;
  totalPace: number;
  activityCount: number;
  totalMovingTime: number;
  lastSyncedAt?: string;
  createdAt: string;
}

export interface Activity {
  _id: string;
  stravaId: string;
  userId: string;
  name: string;
  distance: number;
  movingTime: number;
  elapsedTime: number;
  type: 'Run' | 'Walk' | 'Hike';
  startDate: string;
  startLatLng?: [number, number];
  polyline?: string;
}

export interface LeaderboardEntry {
  userId: string;
  firstName: string;
  lastName: string;
  profileEmoji: string;
  bio?: string;
  totalDistance: number;
  totalActivities: number;
  avgPace: number;
  totalMovingTime: number;
}
