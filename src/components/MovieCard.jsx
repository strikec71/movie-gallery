import React, { memo } from 'react';

/**
 * КАРТОЧКА ФИЛЬМА (MEMOIZED)
 * Оптимизирована для предотвращения лишних рендеров в больших списках.
 * Поддерживает статусы "Избранное" и "Просмотрено".
 */
const MovieCard = memo(({ 
  movie, 
  isFavorite, 
  isWatched, 
  onToggleFavorite, 
  onToggleWatched, 
  onClick 
}) => {
  if (!movie) return null;

  // Обработчик для кнопки избранного
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(movie.id);
  };

  // Обработчик для кнопки просмотра
  const handleWatchedClick = (e) => {
    e.stopPropagation();
    if (onToggleWatched) onToggleWatched(movie.id);
  };

  return (
    <div 
      className={`movie-card ${isWatched ? 'watched-mode' : ''}`} 
      onClick={() => onClick && onClick(movie)}
      style={{ opacity: isWatched ? 0.6 : 1 }}
    >
      {/* ПЕРЕДНЯЯ ПАНЕЛЬ: ПОСТЕР И БЕЙДЖИ */}
      <div className="movie-poster">
        <img 
          src={movie.poster} 
          alt={movie.title} 
          loading="lazy" 
        />
        
        {/* Статус просмотренного (Бейдж) */}
        {isWatched && (
          <div className="status-badge-watched">
            ✔️ Просмотрено
          </div>
        )}
        
        {/* Рейтинг и Популярность */}
        <span className={`movie-rating ${isWatched ? 'shifted' : ''}`}>
          ⭐ {Number(movie.rating).toFixed(1)}
        </span>
        
        <span className="movie-popularity">
          🔥 {movie.popularity}
        </span>
        
        {/* НИЖНЯЯ ПАНЕЛЬ ДЕЙСТВИЙ (Появляется при наведении или всегда на мобилках) */}
        <div className="card-actions-overlay">
          
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
          
        </div>
      </div>
      
      {/* ИНФОРМАЦИОННАЯ ПАНЕЛЬ */}
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
    </div>
  );
});

// Стили для новых классов, которые нужно добавить в index.css (секция карточек)
// Мы их уже частично прописали в прошлом шаге, но здесь они закреплены за JSX.

export default MovieCard;