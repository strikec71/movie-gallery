import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MovieCard from '../../components/MovieCard';
import { MovieContext } from '../../context/MovieContext';
import { AuthContext } from '../../context/AuthContext';

const mockMovie = {
  id: 777,
  title: 'Матрица',
  rating: 9.5,
  poster: 'https://example.com/matrix.jpg',
  genres: ['Sci-Fi'],
};

const movieCtx = {
  favorites: [],
  watched: [],
  toggleFavorite: vi.fn(),
  toggleWatched: vi.fn(),
  deleteMovie: vi.fn(),
};

const authCtx = {
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

const renderCard = (ui) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={authCtx}>
        <MovieContext.Provider value={movieCtx}>{ui}</MovieContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Тестирование паттерна Compound Components: MovieCard', () => {
  test('Должен корректно собирать карточку из дочерних компонентов', () => {
    renderCard(
      <MovieCard movie={mockMovie}>
        <MovieCard.Poster />
        <MovieCard.Info />
      </MovieCard>
    );

    expect(screen.getByText('Матрица')).toBeInTheDocument();
    expect(screen.getByTitle('В избранное')).toBeInTheDocument();
  });

  test('Должен вызывать функцию onClick при клике', () => {
    const handleClickMock = vi.fn();

    renderCard(
      <MovieCard movie={mockMovie} onClick={handleClickMock}>
        <MovieCard.Info />
      </MovieCard>
    );

    const titleElement = screen.getByText('Матрица');
    fireEvent.click(titleElement);

    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });
});
