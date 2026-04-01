import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import MovieList from '../MovieList';
import { MovieContext } from '../../context/MovieContext';
import { describe, it, expect, vi } from 'vitest';

const mockMovies = [
  { id: 1, title: 'Матрица', rating: 8.7, genres: ['Action'], poster: 'url1' },
  { id: 2, title: 'Аватар', rating: 8.0, genres: ['Sci-Fi'], poster: 'url2' }
];

describe('Тестирование компонента MovieList', () => {
  it('Должен рендерить переданные фильмы', () => {
    render(
      <MovieContext.Provider value={{ watched: [], toggleWatched: vi.fn() }}>
        <MovieList 
          movies={mockMovies} 
          favorites={[]} 
          onToggleFavorite={vi.fn()} 
          onMovieClick={vi.fn()} 
        />
      </MovieContext.Provider>
    );

    // Проверяем, появились ли названия фильмов на экране
    expect(screen.getByText('Матрица')).toBeInTheDocument();
    expect(screen.getByText('Аватар')).toBeInTheDocument();
  });
});