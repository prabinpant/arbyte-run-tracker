import React, { useState } from 'react'
import './index.css'
import { Button } from './components/Button'
import { Card } from './components/Card'
import { LeaderboardTable } from './components/LeaderboardTable'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    fetch('http://localhost:3001/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data.leaderboard || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-shake">
        <h1 style={{ fontSize: '4rem', color: 'var(--primary)', textShadow: '4px 4px 0px black' }}>
          ARBYTE 100KM
        </h1>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', background: 'white', display: 'inline-block', padding: '0.5rem 1rem', transform: 'rotate(-2deg)', border: '3px solid black' }}>
          APRIL CHALLENGE 🏃‍♂️💨
        </h2>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {!isLoggedIn ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Card title="Ready to join the race?" className="animate-float">
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                Track your Walk, Run, and Hike activities. 
                <br /> Conquer 100km this April!
              </p>
              <Button onClick={() => window.location.href = 'http://localhost:3001/api/auth/strava'} variant="secondary" style={{ fontSize: '1.5rem', padding: '1rem 3rem' }}>
                🚀 LOGIN WITH STRAVA
              </Button>
            </Card>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem' }}>👟</div>
                  <h3>Your Distance</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>38.4 km</p>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem' }}>🏁</div>
                  <h3>Rank</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>#2</p>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem' }}>📈</div>
                  <h3>Remaining</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>61.6 km</p>
                </div>
              </Card>
            </div>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h3 className="font-fun">Loading Challenger Data... 🏁</h3>
              </div>
            ) : (
              <LeaderboardTable entries={leaderboard} />
            )}

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Button onClick={() => setIsLoggedIn(false)} variant="accent">
                LOGOUT
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer style={{ marginTop: '5rem', textAlign: 'center', opacity: 0.7, padding: '1rem' }}>
        <p>© 2026 ARBYTE RUN CLUB | 90s VIBES ONLY</p>
      </footer>
    </div>
  )
}

export default App
