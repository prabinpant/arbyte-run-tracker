import { Card } from './Card';
import type { LeaderboardEntry } from '../../../shared';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries }) => {
  const formatPace = (paceInSeconds: number) => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = (paceInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds} /km`;
  };

  const formatDuration = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = (durationInSeconds % 60).toString().padStart(2, '0');
    return hours > 0 
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds}`
      : `${minutes}:${seconds}`;
  };

  return (
    <div className="leaderboard-container">
      <Card title="🏆 Top Challengers">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr style={{ textAlign: 'left', fontFamily: 'var(--font-heading)' }}>
                <th style={{ padding: '12px' }}>Rank</th>
                <th style={{ padding: '12px' }}>Athlete</th>
                <th style={{ padding: '12px' }}>Distance</th>
                <th style={{ padding: '12px' }}>Avg. Pace</th>
                <th style={{ padding: '12px' }}>Activities</th>
                <th style={{ padding: '12px' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((user) => (
                <tr key={user.id} className="cartoon-border" style={{ backgroundColor: '#fff', marginBottom: '8px' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '1.2rem' }}>#{user.rank}</td>
                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{user.profileEmoji || '🏃'}</span>
                    <div style={{ fontWeight: 'bold' }}>{user.firstName} {user.lastName}</div>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    {(user.totalDistance / 1000).toFixed(2)} km
                  </td>
                  <td style={{ padding: '12px' }}>
                    {formatPace(user.totalPace)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {user.activityCount}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {formatDuration(user.totalMovingTime)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
