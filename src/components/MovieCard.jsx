import React, { memo } from 'react';

const MovieCard = memo(({ movie, isFavorite, isWatched, onToggleFavorite, onToggleWatched, onClick }) => {
  if (!movie) return null;

  return (
    <div 
      className="movie-card" 
      onClick={() => onClick && onClick(movie)} 
      style={{ opacity: isWatched ? 0.6 : 1, transition: 'all 0.4s var(--ease-out-back)' }}
    >
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} loading="lazy" />
        
        {isWatched && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0, 230, 118, 0.85)', backdropFilter: 'blur(4px)', color: 'black', padding: '4px 8px', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', zIndex: 6 }}>
            ✔️ Просмотрено
          </div>
        )}
        
        <span className="movie-rating" style={{ top: isWatched ? '45px' : '12px' }}>⭐ {Number(movie.rating).toFixed(1)}</span>
        <span className="movie-popularity">🔥 {movie.popularity}</span>
        
        <div style={{ position: 'absolute', bottom: '15px', left: '10px', right: '10px', display: 'flex', gap: '8px', zIndex: 10, opacity: 0, transition: 'opacity 0.3s', transform: 'translateY(10px)' }} className="card-hover-actions">
          
          <button 
            className={`add-favorite-btn ${isFavorite ? 'active' : ''}`}
            style={{ position: 'static', transform: 'none', width: 'auto', flex: 1, margin: 0, opacity: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite(movie.id);
            }}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          
          <button 
            style={{ 
              flex: 3, padding: '10px 0', background: isWatched ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 255, 255, 0.2)', 
              backdropFilter: 'blur(10px)', color: isWatched ? '#00e676' : 'white', 
              border: `1px solid ${isWatched ? '#00e676' : 'rgba(255,255,255,0.3)'}`, borderRadius: '12px', 
              cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.3s'
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleWatched) onToggleWatched(movie.id);
            }}
            onMouseOver={(e) => {
              if(!isWatched) { e.target.style.background = 'white'; e.target.style.color = 'black'; }
            }}
            onMouseOut={(e) => {
              if(!isWatched) { e.target.style.background = 'rgba(255, 255, 255, 0.2)'; e.target.style.color = 'white'; }
            }}
          >
            {isWatched ? 'Отменить' : '👀 Смотреть'}
          </button>
        </div>
      </div>
      
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="movie-genres-container">
          {movie.genres?.slice(0, 3).map((g, index) => (
            <span key={`${movie.id}-${index}`} className="movie-genre">{g}</span>
          ))}
          {movie.genres?.length > 3 && (
            <span className="movie-genre">+{movie.genres.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
});

export default MovieCard;