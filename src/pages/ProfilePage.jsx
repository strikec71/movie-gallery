import React, { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';

const ProfilePage = () => {
  const { favorites } = useContext(MovieContext);

  return (
    <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="profile-card" style={{
        background: 'var(--bg-card)',
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid var(--glass-border)',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          width: '120px', height: '120px', margin: '0 auto 20px',
          borderRadius: '50%', background: 'linear-gradient(135deg, #ff0055, #ff4081)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3rem', boxShadow: '0 0 20px rgba(255, 0, 85, 0.5)'
        }}>
          👤
        </div>

        <h2 style={{ marginBottom: '10px' }}>Киноман 3000</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>student@example.com</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gold)' }}>
              {favorites.length}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Избранных фильмов</div>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff4081' }}>
              PRO
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Статус аккаунта</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;