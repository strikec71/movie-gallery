import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { MovieContext } from '../context/MovieContext';

/**
 * КОМПОНЕНТ НАВИГАЦИИ (NAVBAR)
 * Поддерживает активные состояния ссылок и живой счетчик избранного
 */
const NavBar = () => {
  const { favorites } = useContext(MovieContext);

  return (
    <nav className="navbar">
      {/* ЛОГОТИП И БРЕНД */}
      <div className="navbar-brand">
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <h1>🎬 <span className="gradient-text">Movie Gallery</span></h1>
        </NavLink>
      </div>

      {/* НАВИГАЦИОННЫЕ ССЫЛКИ */}
      <div className="navbar-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
          end
        >
          <span>🏠</span> Главная
        </NavLink>

        <NavLink 
          to="/movies" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <span>🎞️</span> Фильмы
        </NavLink>

        <NavLink 
          to="/favorites" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <span>💖</span> Избранное 
          {favorites.length > 0 && (
            <span className="badge">{favorites.length}</span>
          )}
        </NavLink>

        <NavLink 
          to="/add-movie" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <span>➕</span> Добавить
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <span>👤</span> Профиль
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;