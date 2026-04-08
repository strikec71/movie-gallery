import React from 'react';

const MovieListWrapper = ({ movies, render }) => {
  if (!movies || movies.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
        <h2>Ничего не найдено 😢</h2>
        <p>Попробуйте изменить параметры поиска или фильтры.</p>
      </div>
    );
  }

  return (
    <div className="movies-grid">
      {movies.map((movie) => (
        <React.Fragment key={movie.id}>
          {render(movie)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MovieListWrapper;