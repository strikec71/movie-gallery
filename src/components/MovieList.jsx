import React, { useContext, useMemo } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieCard from './MovieCard';

/**
 * КОМПОНЕНТ СПИСКА ФИЛЬМОВ
 * Отвечает за рендеринг сетки карточек и синхронизацию состояний
 * (избранное, просмотры, клики).
 */
const MovieList = ({ movies, favorites, onToggleFavorite, onMovieClick }) => {
  // Извлекаем логику просмотренных фильмов из глобального контекста
  const { watched, toggleWatched } = useContext(MovieContext);

  // Если фильмов нет (например, после фильтрации), выводим сообщение
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
        // Проверяем статус фильма в избранном (через пропсы)
        const isFavorite = favorites.includes(movie.id);
        
        // Проверяем статус фильма в просмотренном (через контекст)
        // Добавлена проверка на существование массива watched для безопасности
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