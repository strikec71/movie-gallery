import React, { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { useScreenshotProtection } from '../hooks/useScreenshotProtection';
import withAuth from '../hoc/withAuth';
import { Link } from 'react-router-dom'; // Импортируем Link для переходов

const ProfilePage = () => {
  const { favorites, watched } = useContext(MovieContext);
  const { user, signOut, isAdmin } = useAuth();

  useScreenshotProtection();

  const registerDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('ru-RU')
    : 'Неизвестно';

  return (
    <div className="page-container" style={{ animation: 'fadeInUp 0.8s var(--ease-spring)' }}>
      
      <div className="profile-wrapper" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        <div className="profile-card" style={{
          background: 'var(--bg-card)',
          padding: 'clamp(20px, 8vw, 60px)',
          borderRadius: '30px',
          border: '1px solid var(--glass-border)',
          textAlign: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-50px', right: '-50px',
            width: '200px', height: '200px', background: 'var(--primary)',
            filter: 'blur(100px)', opacity: '0.15', pointerEvents: 'none'
          }}></div>

          <div className="profile-avatar" style={{
            width: '140px', height: '140px', margin: '0 auto 25px',
            borderRadius: '50%', background: 'linear-gradient(135deg, #ff0055, #ff4081)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '4rem', boxShadow: '0 0 30px rgba(255, 0, 85, 0.4)',
            border: '4px solid rgba(255,255,255,0.1)'
          }}>
            👤
          </div>

          <h2 style={{ fontSize: '2.2rem', marginBottom: '10px', fontWeight: '800' }}>
            {isAdmin ? 'Администратор' : 'Киноман 3000'}
          </h2>
          
          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '5px' }}>
            {user?.email}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '40px' }}>
            В клубе с: {registerDate}
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '20px',
            marginTop: '20px'
          }}>
            {/* Ссылка на Избранное */}
            <Link to="/favorites" style={{ textDecoration: 'none', transition: 'transform 0.2s', display: 'block' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--glass-border)', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--gold)' }}>{favorites.length}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>В избранном</div>
              </div>
            </Link>

            {/* Ссылка на Просмотренное */}
            <Link to="/watched" style={{ textDecoration: 'none', transition: 'transform 0.2s', display: 'block' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--glass-border)', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#00e676' }}>{watched ? watched.length : 0}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Просмотрено</div>
              </div>
            </Link>

            {/* Статичный блок уровня */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ff4081' }}>{isAdmin ? 'GOD' : 'PRO'}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Уровень</div>
            </div>
          </div>

          <button className="btn-secondary" style={{ marginTop: '40px', width: '100%', border: '1px solid var(--glass-border)' }}>
            ⚙️ Редактировать профиль
          </button>

          <button 
            onClick={signOut} 
            style={{ 
              marginTop: '20px', 
              width: '100%', 
              padding: '16px', 
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.05) 0%, rgba(255, 0, 85, 0.1) 100%)', 
              color: '#ff3366',
              border: '1px solid rgba(255, 51, 102, 0.2)',
              cursor: 'pointer',
              fontWeight: '800',
              fontSize: '1rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 4px 15px rgba(255, 51, 102, 0.05)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ff3366 0%, #ff0055 100%)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(255, 0, 85, 0.4)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.border = '1px solid rgba(255, 51, 102, 0)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 51, 102, 0.05) 0%, rgba(255, 0, 85, 0.1) 100%)';
              e.currentTarget.style.color = '#ff3366';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 51, 102, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.border = '1px solid rgba(255, 51, 102, 0.2)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.96)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(255, 0, 85, 0.3)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
          >
            <span style={{ fontSize: '1.3rem' }}></span> Выйти из аккаунта
          </button>
        </div>

      </div>
    </div>
  );
};

export default withAuth(ProfilePage);