import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MovieContext } from '../context/MovieContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ThemeModal from './ThemeModal';
import AuthModal from './AuthModal';

const NavBar = () => {
  const { favorites } = useContext(MovieContext);
  const { theme, availableThemes } = useTheme();
  
  const { user, isAdmin, isAuthModalOpen, setIsAuthModalOpen } = useAuth(); 

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const currentIcon = availableThemes.find(th => th.id === theme)?.icon || '🌌';

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <h1>🎬 <span className="gradient-text">Movie Gallery</span></h1>
          </NavLink>
        </div>

        <div className="navbar-links" style={{ display: 'flex', alignItems: 'center' }}>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
            <span>🏠</span> Главная
          </NavLink>

          <NavLink to="/movies" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <span>🎞️</span> Фильмы
          </NavLink>

          <NavLink to="/favorites" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <span>💖</span> Избранное
            {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
          </NavLink>

          {user ? (
            <>
              {isAdmin && (
                <NavLink to="/add-movie" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  <span>➕</span> Добавить
                </NavLink>
              )}
              <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <span>👤</span> Профиль
              </NavLink>
            </>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)} 
              className="nav-link" 
              style={{ background: 'var(--primary)', color: 'var(--text-on-primary)', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold' }}
            >
              <span>🔑</span> Войти
            </button>
          )}

          <button 
            onClick={() => setIsThemeModalOpen(true)}
            title="Оформление сайта"
            style={{
              background: 'var(--glass)', border: '1px solid var(--glass-border)',
              borderRadius: '50%', width: '40px', height: '40px',
              cursor: 'pointer', fontSize: '1.2rem', marginLeft: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            {currentIcon}
          </button>
        </div>
      </nav>

      <ThemeModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default NavBar;