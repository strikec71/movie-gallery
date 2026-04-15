import React, { memo } from 'react';

// Memoized card to reduce rerenders in large lists.
const MovieCard = memo(({ 
  movie, 
  isFavorite, 
  isWatched, 
  onToggleFavorite, 
  onToggleWatched, 
  onClick 
}) => {
  if (!movie) return null;

  // Prevent parent card click when action buttons are pressed.
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(movie.id);
  };

  // Keep action events scoped to the button.
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
      <div className="movie-poster">
        <img 
          src={movie.poster} 
          alt={movie.title} 
          loading="lazy" 
        />
        
        {isWatched && (
          <div className="status-badge-watched">
            ✔️ Просмотрено
          </div>
        )}
        
        <span className={`movie-rating ${isWatched ? 'shifted' : ''}`}>
          ⭐ {Number(movie.rating).toFixed(1)}
        </span>
        
        <span className="movie-popularity">
          🔥 {movie.popularity}
        </span>
        
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


export default MovieCard;