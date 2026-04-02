import { Card } from './Card';
import type { LeaderboardEntry } from '../../../shared';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries }) => {
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
                <th style={{ padding: '12px' }}>Pace</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((user) => (
                <tr key={user.id} className="cartoon-border" style={{ backgroundColor: '#fff', marginBottom: '8px' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '1.2rem' }}>#{user.rank}</td>
                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{user.profileEmoji || '🏃'}</span>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{user.firstName} {user.lastName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>{user.activityCount} Activities</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    {(user.totalDistance / 1000).toFixed(2)} km
                  </td>
                  <td style={{ padding: '12px' }}>
                    {Math.floor(user.totalPace / 60)}:{(user.totalPace % 60).toString().padStart(2, '0')} /km
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
