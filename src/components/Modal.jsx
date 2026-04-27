import React, { useContext, useEffect, useState } from 'react';
import { MovieContext } from '../context/MovieContext';
import { useNavigate } from 'react-router-dom';

const Modal = ({ movie, onClose }) => {
  const { getMovieVideo, toggleFavorite, favorites, watched, toggleWatched, customMovies, deleteMovie } = useContext(MovieContext);
  const [trailerKey, setTrailerKey] = useState(null);
  const navigate = useNavigate();
  
  // ИСПРАВЛЕНО ЗДЕСЬ: Умная проверка для избранного и просмотренного
  const isFavorite = Array.isArray(favorites) && favorites.some(f => String(f?.id || f) === String(movie?.id));
  const isWatched = Array.isArray(watched) && watched.some(w => String(w?.id || w) === String(movie?.id));
  
  const isCustomMovie = customMovies?.some(m => String(m.id) === String(movie?.id));

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

  const handleDelete = async () => {
    if (window.confirm("Удалить этот фильм из вашей коллекции?")) {
      await deleteMovie(movie.id);
      onClose();
    }
  };

  const handleEdit = () => {
    onClose();
    navigate(`/add-movie?edit=${movie.id}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
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
            
            {isCustomMovie && (
              <button 
                className="modal-btn" 
                style={{ background: 'var(--gold)', color: '#000', border: 'none' }}
                onClick={handleEdit}
              >
                🖊️ Редактировать
              </button>
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