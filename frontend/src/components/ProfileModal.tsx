import React, { useEffect, useState } from 'react';
import type { LeaderboardEntry, Activity } from '../../../shared/index';

interface ProfileModalProps {
  athlete: LeaderboardEntry;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ athlete, onClose }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users/${athlete.userId}/activities`);
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [athlete.userId]);

  const formatDistance = (meters: number) => (meters / 1000).toFixed(2);
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPace = (secondsPerKm: number) => {
    const mins = Math.floor(secondsPerKm / 60);
    const secs = Math.round(secondsPerKm % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-1rem',
            right: '-1rem',
            background: 'hsl(var(--primary))',
            border: '4px solid black',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Bangers',
            transform: 'rotate(5deg)'
          }}
        >
          X
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '5rem', 
            marginBottom: '1rem', 
            background: '#eee', 
            width: '120px', 
            height: '120px', 
            margin: '0 auto 1rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '50%',
            border: '4px solid black',
            boxShadow: 'var(--shadow)'
          }}>{athlete.profileEmoji}</div>
          <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'black' }}>{athlete.firstName} {athlete.lastName}</h2>
          {athlete.bio ? (
            <p style={{ color: 'black', fontWeight: 600, maxWidth: '400px', margin: '0 auto' }}>
              "{athlete.bio}"
            </p>
          ) : (
            <p style={{ color: 'black', opacity: 0.5, fontWeight: 600 }}>Training in stealth mode...</p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div className="glass-card" style={{ textAlign: 'center', padding: '1rem', background: 'hsl(var(--secondary))', color: 'white' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>TOTAL DISTANCE</div>
            <div style={{ fontSize: '2rem', fontWeight: 'normal', fontFamily: 'Bangers' }}>
              {formatDistance(athlete.totalDistance)} KM
            </div>
          </div>
          <div className="glass-card" style={{ textAlign: 'center', padding: '1rem', background: 'hsl(var(--accent))', color: 'black' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>AVG PACE</div>
            <div style={{ fontSize: '2rem', fontWeight: 'normal', fontFamily: 'Bangers' }}>
              {formatPace(athlete.avgPace)} /KM
            </div>
          </div>
        </div>

        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>April Activity Feed</h3>
        
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', fontWeight: 800 }}>Loading runs...</p>
        ) : activities.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activities.map(activity => (
              <div key={activity._id} className="glass-card" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{activity.name}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{formatDate(activity.startDate)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'normal', fontFamily: 'Bangers', fontSize: '1.5rem', color: 'hsl(var(--primary))' }}>{formatDistance(activity.distance)} KM</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{formatPace(activity.movingTime / (activity.distance / 1000))} /KM</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--muted-foreground))' }}>
            No activities recorded in April yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
