import React, { useContext, useMemo } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieCard from './MovieCard';

const MovieList = ({ movies, favorites, onToggleFavorite, onMovieClick }) => {
  const { watched, toggleWatched } = useContext(MovieContext);

  if (!movies || movies.length === 0) {
    return (
      <div className="no-results" style={{ gridColumn: '1 / -1', padding: '100px 20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
        <h3>Ничего не найдено</h3>
        <p style={{ color: 'var(--text-muted)' }}>Попробуйте изменить параметры поиска или фильтры.</p>
      </div>
    );
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => {
        const isFavorite = favorites.includes(movie.id);
        
        const isWatched = Array.isArray(watched) ? watched.includes(movie.id) : false;

        return (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            isFavorite={isFavorite}
            isWatched={isWatched}
            onToggleFavorite={onToggleFavorite}
            onToggleWatched={toggleWatched}
            onClick={() => onMovieClick(movie)} 
          />
        );
      })}
    </div>
  );
};

export default MovieList;