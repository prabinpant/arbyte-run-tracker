import React from 'react';
import type { LeaderboardEntry } from '../../../shared/index';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  onAthleteClick?: (userId: string) => void;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, onAthleteClick }) => {
  const formatDistance = (meters: number) => (meters / 1000).toFixed(2);
  
  const formatPace = (secondsPerKm: number) => {
    const mins = Math.floor(secondsPerKm / 60);
    const secs = Math.round(secondsPerKm % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);
    return hours > 0 
      ? `${hours}h ${mins}m` 
      : `${mins}m ${secs}s`;
  };

  return (
    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Athlete</th>
              <th>Distance</th>
              <th>Avg. Pace</th>
              <th>Activities</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr 
                key={entry.userId} 
                className="interactive-row"
                onClick={() => onAthleteClick?.(entry.userId)}
              >
                <td style={{ fontWeight: 800, color: 'black', fontFamily: 'Bangers', fontSize: '1.25rem' }}>
                  #{index + 1}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      background: index < 3 ? 'hsl(var(--accent))' : '#eee', 
                      width: '40px', 
                      height: '40px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      borderRadius: '50%',
                      border: '2px solid black'
                    }}>
                      {entry.profileEmoji}
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{entry.firstName} {entry.lastName}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 800, color: 'hsl(var(--primary))', fontSize: '1.25rem', fontFamily: 'Bangers', letterSpacing: '0.07em' }}>
                  {formatDistance(entry.totalDistance)} KM
                </td>
                <td style={{ fontWeight: 600 }}>{formatPace(entry.avgPace)} /KM</td>
                <td style={{ fontWeight: 600 }}>{entry.totalActivities}</td>
                <td style={{ fontWeight: 600 }}>{formatDuration(entry.totalMovingTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
