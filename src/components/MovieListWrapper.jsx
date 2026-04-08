import React from 'react';

const MovieListWrapper = ({ movies, render }) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <React.Fragment key={movie.id}>
          {render(movie)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MovieListWrapper;