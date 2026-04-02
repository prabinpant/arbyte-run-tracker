import { useState, useEffect } from 'react';
import LeaderboardTable from './components/LeaderboardTable';
import ProfileModal from './components/ProfileModal';
import type { LeaderboardEntry } from './types/index';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setIsLoggedIn(true);
        setBioText(data.bio || '');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/leaderboard`, { credentials: 'include' });
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setIsLoggedIn(false);
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleUpdateBio = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: bioText }),
        credentials: 'include'
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setIsEditingBio(false);
        fetchLeaderboard();
      }
    } catch (err) {
      console.error('Failed to update bio:', err);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentUserEntry = leaderboard.find(entry => entry.userId === user?._id);
  const userDistance = currentUserEntry ? (currentUserEntry.totalDistance / 1000) : 0;
  const userRank = currentUserEntry ? leaderboard.findIndex(e => e.userId === currentUserEntry.userId) + 1 : '-';
  const remainingDistance = Math.max(0, 100 - userDistance);
  const progressPercentage = Math.min(100, (userDistance / 100) * 100);

  const selectedAthlete = leaderboard.find(entry => entry.userId === selectedAthleteId);

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '4rem', transform: 'rotate(-1deg)' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', marginBottom: '0.5rem', lineHeight: 1, letterSpacing: '-0.05em' }}>
          ARBYTE <span className="neon-text">RUN SQUAD!</span>
        </h1>
        <p style={{ 
          background: 'black', 
          color: 'white', 
          display: 'inline-block', 
          padding: '0.25rem 1rem', 
          fontWeight: 800, 
          fontSize: '1.25rem',
          transform: 'rotate(1deg)'
        }}>
          APRIL 2026 CHALLENGE • 100KM OR BUST!
        </p>
      </header>

      {isLoggedIn && ( 
        <section style={{ marginBottom: '4rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome, {user?.firstName}!</h2>
                {isEditingBio ? (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      value={bioText} 
                      onChange={(e) => setBioText(e.target.value)}
                      placeholder="Enter a short bio..."
                      maxLength={100}
                      style={{
                        background: 'white',
                        border: '4px solid black',
                        color: 'black',
                        padding: '0.5rem',
                        borderRadius: '0px',
                        width: '300px',
                        fontFamily: 'inherit',
                        fontWeight: 600
                      }}
                    />
                    <button onClick={handleUpdateBio} className="neon-button" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Save</button>
                    <button onClick={() => setIsEditingBio(false)} className="neon-button secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Cancel</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <p style={{ color: 'hsl(var(--muted-foreground))' }}>{user.bio || 'No bio set. Let others know your goal!'}</p>
                    <button 
                      onClick={() => setIsEditingBio(true)} 
                      style={{ background: 'none', border: 'none', color: 'hsl(var(--accent))', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}
                    >
                      Edit Bio
                    </button>
                  </div>
                )}
              </div>
              <button onClick={handleLogout} className="neon-button secondary">Logout</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div className="glass-card" style={{ background: 'hsl(var(--secondary))', color: 'white' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>MILES CLOBBERED</div>
                <div style={{ fontSize: '3rem', fontWeight: 'normal', fontFamily: 'Bangers' }}>{userDistance.toFixed(2)}<span style={{ fontSize: '1.25rem', marginLeft: '0.25rem' }}>KM</span></div>
              </div>
              <div className="glass-card" style={{ background: 'hsl(var(--accent))', color: 'black' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>SQUAD RANK</div>
                <div style={{ fontSize: '3rem', fontWeight: 'normal', fontFamily: 'Bangers' }}>#{userRank}</div>
              </div>
              <div className="glass-card" style={{ background: 'white', color: 'black' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>GOAL TO GO</div>
                <div style={{ fontSize: '3rem', fontWeight: 'normal', fontFamily: 'Bangers' }}>{remainingDistance.toFixed(2)}<span style={{ fontSize: '1.25rem', marginLeft: '0.25rem' }}>KM</span></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                <span style={{ fontWeight: 800, textTransform: 'uppercase' }}>Challenge Progress</span>
                <span style={{ fontWeight: 800, fontFamily: 'Bangers', fontSize: '1.5rem' }}>{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isLoggedIn && (
        <section style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <div className="glass-card" style={{ padding: '3rem 2rem', background: 'white' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>ARE YOU TOUGH ENOUGH?</h2>
            <p style={{ color: 'black', fontWeight: 600, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.1rem' }}>
              Track your April runs, climb the global leaderboard, and join the Arbyte elite squad. Automatic Strava syncing ensures you never miss a kilometer!
            </p>
            <a href={`${API_URL}/api/auth/strava`} className="neon-button" style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}>
              GET RAD WITH STRAVA!
            </a>
          </div>
        </section>
      )}

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem' }}>Global Leaderboard</h2>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>Live rankings for the April 100km squad</p>
          </div>
          {loading && <div style={{ color: 'hsl(var(--accent))', fontSize: '0.875rem', fontWeight: 600 }}>SYNCING...</div>}
        </div>
        
        <LeaderboardTable 
          entries={leaderboard} 
          onAthleteClick={(userId) => setSelectedAthleteId(userId)}
        />
      </section>

      <footer style={{ marginTop: '6rem', paddingBottom: '4rem', textAlign: 'center', color: 'black', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase' }}>
        <p>© 2026 ARBYTE RUN SQUAD • RADICAL 90S EDITION</p>
      </footer>

      {selectedAthleteId && selectedAthlete && (
        <ProfileModal 
          athlete={selectedAthlete} 
          onClose={() => setSelectedAthleteId(null)} 
        />
      )}
    </div>
  );
}

export default App;
