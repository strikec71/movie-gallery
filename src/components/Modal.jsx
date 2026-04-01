import React, { useContext, useEffect, useState } from 'react';
import { MovieContext } from '../context/MovieContext';

const Modal = ({ movie, onClose }) => {
  const { getMovieVideo, toggleFavorite, favorites, watched, toggleWatched, customMovies, deleteMovie } = useContext(MovieContext);
  const [trailerKey, setTrailerKey] = useState(null);
  
  const isFavorite = favorites?.some(f => f.id === movie?.id);
  const isWatched = watched?.includes(movie?.id);
  const isCustomMovie = customMovies?.some(m => m.id === movie?.id);

  useEffect(() => {
    let isMounted = true;
    const fetchVideo = async () => {
      if (movie?.id && !isCustomMovie) {
        const key = await getMovieVideo(movie.id);
        if (isMounted) setTrailerKey(key);
      }
    };
    fetchVideo();
    return () => { isMounted = false; };
  }, [movie, getMovieVideo, isCustomMovie]);

  if (!movie) return null;

  const handleDelete = () => {
    if (window.confirm("Удалить этот фильм из вашей коллекции?")) {
      deleteMovie(movie.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        {/* ВЕРХНЯЯ ЧАСТЬ: ФОН И ПОСТЕР */}
        <div className="modal-header" style={{backgroundImage: `url(${movie.poster})`}}>
          <div className="modal-poster-shadow"></div>
          <img src={movie.poster} alt={movie.title} className="modal-poster-img" />
          
          <div className="modal-header-info">
            <h2>
              {movie.title} 
              {isWatched && <span className="status-badge-watched">✔️ ПРОСМОТРЕНО</span>}
            </h2>
            {movie.originalTitle && <p className="modal-original-title">{movie.originalTitle}</p>}
            
            <div className="modal-genres">
              {movie.genres?.map(g => <span key={g} className="genre-tag-modal">{g}</span>)}
            </div>
          </div>
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="modal-body">
          <div className="modal-stats">
            <div className="stat-item">
              <span className="stat-label">Рейтинг</span>
              <span className="stat-value star">⭐ {movie.rating}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Популярность</span>
              <span className="stat-value fire">🔥 {movie.popularity}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Язык</span>
              <span className="stat-value lang">{movie.language?.toUpperCase() || 'RU'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Год</span>
              <span className="stat-value">{movie.year}</span>
            </div>
          </div>

          <p className="modal-description">{movie.description}</p>
          
          {/* ТРЕЙЛЕР */}
          {trailerKey && (
            <div className="video-container">
              <h3>🎬 Трейлер фильма</h3>
              <div className="iframe-wrapper">
                <iframe 
                  src={`https://www.youtube.com/embed/${trailerKey}`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* КНОПКИ ДЕЙСТВИЙ */}
          <div className="modal-actions">
            {!isCustomMovie && (
              <a 
                href={`https://www.kinopoisk.ru/index.php?kp_query=${encodeURIComponent(movie.title)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="modal-btn btn-kp"
              >
                🍿 Кинопоиск
              </a>
            )}
            
            <button 
              className={`modal-btn btn-fav ${isFavorite ? 'active' : ''}`} 
              onClick={() => toggleFavorite(movie.id)}
            >
              {isFavorite ? '💔 Из избранного' : '❤️ В избранное'}
            </button>

            <button 
              className={`modal-btn btn-watch ${isWatched ? 'active' : ''}`}
              onClick={() => toggleWatched(movie.id)}
            >
              {isWatched ? '🔄 Отменить просмотр' : '👀 Просмотрено'}
            </button>

            {isCustomMovie && (
              <button className="modal-btn btn-delete" onClick={handleDelete}>
                🗑️ Удалить фильм
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;