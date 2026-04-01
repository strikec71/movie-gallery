import React, { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';

/**
 * СТРАНИЦА ПРОФИЛЯ
 * Отображает статистику пользователя и его статус в системе.
 */
const ProfilePage = () => {
  // Достаем не только избранное, но и просмотренные (раз уж мы их сделали!)
  const { favorites, watched } = useContext(MovieContext);

  return (
    <div className="page-container" style={{ animation: 'fadeInUp 0.8s var(--ease-spring)' }}>
      <div className="profile-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div className="profile-card" style={{
          background: 'var(--bg-card)',
          padding: 'clamp(20px, 8vw, 60px)', // Адаптивные отступы
          borderRadius: '30px',
          border: '1px solid var(--glass-border)',
          textAlign: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Декоративный эффект на фоне */}
          <div style={{
            position: 'absolute', top: '-50px', right: '-50px',
            width: '200px', height: '200px', background: 'var(--primary)',
            filter: 'blur(100px)', opacity: '0.15', pointerEvents: 'none'
          }}></div>

          {/* АВАТАР */}
          <div className="profile-avatar" style={{
            width: '140px', height: '140px', margin: '0 auto 25px',
            borderRadius: '50%', background: 'linear-gradient(135deg, #ff0055, #ff4081)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '4rem', boxShadow: '0 0 30px rgba(255, 0, 85, 0.4)',
            border: '4px solid rgba(255,255,255,0.1)'
          }}>
            👤
          </div>

          <h2 style={{ fontSize: '2.2rem', marginBottom: '10px', fontWeight: '800' }}>Киноман 3000</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px' }}>
            alisher_pro_dev@example.com
          </p>

          {/* СЕТКА СТАТИСТИКИ */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '20px',
            marginTop: '20px'
          }}>
            
            {/* Карточка: Избранное */}
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', 
              padding: '20px', 
              borderRadius: '20px', 
              border: '1px solid var(--glass-border)',
              transition: 'transform 0.3s'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--gold)' }}>
                {favorites.length}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                В избранном
              </div>
            </div>
            
            {/* Карточка: Просмотрено */}
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', 
              padding: '20px', 
              borderRadius: '20px', 
              border: '1px solid var(--glass-border)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#00e676' }}>
                {watched ? watched.length : 0}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Просмотрено
              </div>
            </div>

            {/* Карточка: Статус */}
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', 
              padding: '20px', 
              borderRadius: '20px', 
              border: '1px solid var(--glass-border)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ff4081' }}>
                PRO
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Уровень
              </div>
            </div>

          </div>

          <button className="btn-secondary" style={{ marginTop: '40px', width: '100%', border: '1px solid var(--glass-border)' }}>
            ⚙️ Редактировать профиль
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;