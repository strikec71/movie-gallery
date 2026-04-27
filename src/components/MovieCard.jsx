import React, { createContext, memo, useContext, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { MovieContext } from '../context/MovieContext';
import { useNavigate } from 'react-router-dom';

const MovieCardContext = createContext(null);

const useMovieCardContext = () => {
  const ctx = useContext(MovieCardContext);
  if (!ctx) throw new Error('MovieCard compound component must be used inside MovieCard.');
  return ctx;
};

const MovieCardBase = memo(({
  movie,
  isFavorite: propIsFavorite, // Принимаем, но перепроверим сами
  isWatched: propIsWatched,   // Принимаем, но перепроверим сами
  onToggleFavorite,
  onToggleWatched,
  onClick,
  children,
}) => {
  // 1. Вытягиваем глобальные данные, чтобы карточка сама знала "правду"
  const { favorites, watched, toggleFavorite, toggleWatched } = useContext(MovieContext);

  if (!movie) return null;

  // 2. УМНАЯ ПРОВЕРКА: Ищем фильм в массиве объектов (надежная защита от старых багов)
  const isFav = propIsFavorite || (Array.isArray(favorites) && favorites.some(f => String(f?.id || f) === String(movie.id)));
  const isWtch = propIsWatched || (Array.isArray(watched) && watched.some(w => String(w?.id || w) === String(movie.id)));

  const finalToggleFav = onToggleFavorite || toggleFavorite;
  const finalToggleWatch = onToggleWatched || toggleWatched;

  // 3. Используем useCallback, чтобы React успевал обновлять контекст
  const handleFavoriteClick = useCallback((e) => {
    e.stopPropagation();
    if (finalToggleFav) finalToggleFav(movie.id);
  }, [finalToggleFav, movie.id]);

  const handleWatchedClick = useCallback((e) => {
    e.stopPropagation();
    if (finalToggleWatch) finalToggleWatch(movie.id);
  }, [finalToggleWatch, movie.id]);

  const contextValue = useMemo(() => ({
    movie,
    isFavorite: isFav,
    isWatched: isWtch,
    handleFavoriteClick,
    handleWatchedClick,
  }), [movie, isFav, isWtch, handleFavoriteClick, handleWatchedClick]);

  const hasCompoundChildren = React.Children.count(children) > 0;

  return (
    <MovieCardContext.Provider value={contextValue}>
      <div
        className={`movie-card ${isWtch ? 'watched-mode' : ''}`}
        onClick={() => onClick && onClick(movie)}
        style={{ opacity: isWtch ? 0.6 : 1 }}
      >
        {hasCompoundChildren ? (
          children
        ) : (
          <>
            <MovieCard.Poster />
            <MovieCard.Info />
          </>
        )}
      </div>
    </MovieCardContext.Provider>
  );
});

const Header = ({ children }) => <div className="movie-card-header">{children}</div>;
const Body = ({ children }) => <div className="movie-card-body">{children}</div>;
const Footer = ({ children }) => <div className="movie-card-footer">{children}</div>;

const Poster = ({ children }) => {
  const { movie, isFavorite, isWatched, handleFavoriteClick, handleWatchedClick } = useMovieCardContext();
  const { isAdmin } = useAuth();
  const { deleteMovie } = useContext(MovieContext);
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Точно удалить фильм?')) {
      deleteMovie(movie.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/add-movie?edit=${movie.id}`);
  };

  return (
    <div className="movie-poster">
      <img
        src={movie.poster || movie.poster_path}
        alt={movie.title}
        loading="lazy"
      />

      {isWatched && (
        <div className="status-badge-watched">
          ✔️ Просмотрено
        </div>
      )}

      <span className={`movie-rating ${isWatched ? 'shifted' : ''}`}>
        ⭐ {Number(movie.rating || movie.vote_average || 0).toFixed(1)}
      </span>

      <span className="movie-popularity">
        🔥 {movie.popularity || 'NEW'}
      </span>

      {isAdmin && movie.isCustom && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '5px', zIndex: 10 }}>
          <button 
            onClick={handleEdit}
            style={{ background: 'var(--glass)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '1rem' }}
            title="Редактировать"
          >
            ✏️
          </button>
          <button 
            onClick={handleDelete}
            style={{ background: 'var(--glass)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '1rem', color: '#ff3b3b' }}
            title="Удалить"
          >
            🗑️
          </button>
        </div>
      )}

      <div className="card-actions-overlay">
        {children || (
          <>
            <button
              className={`favorite-action-btn ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteClick}
              title={isFavorite ? "Удалить из избранного" : "В избранное"}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>

            <button
              className={`watch-action-btn ${isWatched ? 'watched' : ''}`}
              onClick={handleWatchedClick}
            >
              {isWatched ? 'Отменить' : '👀 Смотреть'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const Info = () => {
  const { movie } = useMovieCardContext();
  return (
    <div className="movie-info">
      <h3>{movie.title}</h3>
      <div className="movie-genres-container">
        {movie.genres?.slice(0, 3).map((genre, index) => (
          <span
            key={`${movie.id}-${index}`}
            className="movie-genre"
          >
            {genre}
          </span>
        ))}
        {movie.genres?.length > 3 && (
          <span className="movie-genre-more">
            +{movie.genres.length - 3}
          </span>
        )}
      </div>
    </div>
  );
};

const MovieCard = Object.assign(MovieCardBase, { Header, Body, Footer, Poster, Info });
export default MovieCard;