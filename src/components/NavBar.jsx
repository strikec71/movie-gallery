import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { MovieContext } from '../context/MovieContext';

const NavBar = () => {
  const { favorites } = useContext(MovieContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <h1>🎬 Movie Gallery</h1>
        </NavLink>
      </div>

      <div className="navbar-links">
        <NavLink to="/" className="nav-link" end>Главная</NavLink>
        <NavLink to="/movies" className="nav-link">Фильмы</NavLink>
        <NavLink to="/favorites" className="nav-link">
          Избранное <span className="badge">{favorites.length}</span>
        </NavLink>
        {/* Ссылка на форму добавления */}
        <NavLink to="/add-movie" className="nav-link">Добавить</NavLink>
        <NavLink to="/profile" className="nav-link">Профиль</NavLink>
      </div>
    </nav>
  );
};

export default NavBar;