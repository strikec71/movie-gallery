import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MovieList from '../MovieList';
import { MovieContext } from '../../context/MovieContext';
import { AuthContext } from '../../context/AuthContext';
import { describe, it, expect, vi } from 'vitest';

const mockMovies = [
  { id: 1, title: 'Матрица', rating: 8.7, genres: ['Action'], poster: 'url1' },
  { id: 2, title: 'Аватар', rating: 8.0, genres: ['Sci-Fi'], poster: 'url2' },
];

const movieValue = {
  favorites: [],
  watched: [],
  toggleFavorite: vi.fn(),
  toggleWatched: vi.fn(),
  deleteMovie: vi.fn(),
};

const authValue = {
  user: null,
  loading: false,
  isAdmin: false,
  setIsAuthModalOpen: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  signInWithGoogle: vi.fn(),
  isAuthModalOpen: false,
};

describe('Тестирование компонента MovieList', () => {
  it('Должен рендерить переданные фильмы', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <MovieContext.Provider value={movieValue}>
            <MovieList
              movies={mockMovies}
              favorites={[]}
              onToggleFavorite={vi.fn()}
              onMovieClick={vi.fn()}
            />
          </MovieContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Матрица')).toBeInTheDocument();
    expect(screen.getByText('Аватар')).toBeInTheDocument();
  });
});
