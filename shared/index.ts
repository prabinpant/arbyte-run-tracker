export interface User {
  id: string;
  stravaId: string;
  firstName: string;
  lastName: string;
  profileEmoji?: string;
  totalDistance: number; // in meters
  totalPace: number; // seconds per km
  activityCount: number;
  lastSyncedAt: Date;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface Activity {
  id: string;
  stravaId: string;
  userId: string;
  name: string;
  distance: number; // in meters
  movingTime: number; // in seconds
  elapsedTime: number; // in seconds
  type: 'Run' | 'Walk' | 'Hike';
  startDate: Date;
  startLatLng?: [number, number];
  polyline?: string;
}

export interface LeaderboardEntry extends User {
  rank: number;
}
