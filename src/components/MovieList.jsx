import React, { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieCard from './MovieCard';

const MovieList = ({ movies, favorites, onToggleFavorite, onMovieClick }) => {
  const { watched, toggleWatched } = useContext(MovieContext);

  return (
    <div className="movie-list">
      {movies.map((movie) => {
        const isFavorite = favorites.includes(movie.id);
        const isWatched = watched ? watched.includes(movie.id) : false;

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