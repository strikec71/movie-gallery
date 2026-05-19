import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { MovieContext, MovieDataContext, MovieFilterContext } from '../../context/MovieContext';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';
import MoviesPage from '../MoviesPage';

const mockMovies = [
  {
    id: 1,
    title: 'Inception',
    rating: 8.8,
    description: 'Сон внутри сна',
    poster: 'https://example.com/inception.jpg',
    genres: ['Sci-Fi'],
  },
  {
    id: 2,
    title: 'Interstellar',
    rating: 8.6,
    description: 'Космос и черные дыры',
    poster: 'https://example.com/inter.jpg',
    genres: ['Sci-Fi'],
  },
];

const mockToggleFavorite = vi.fn();
const mockToggleWatched = vi.fn();
const mockSetPage = vi.fn();
const mockGetMovieVideo = vi.fn().mockResolvedValue('fake-trailer-key');
const mockNotify = vi.fn();

const authStub = {
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

const renderWithContext = (component) => {
  const filterValue = {
    page: 1,
    totalPages: 2,
    setPage: mockSetPage,
    searchQuery: '',
    selectedGenres: [],
    sortBy: 'rating',
    sortOrder: 'desc',
  };

  const dataValue = {
    movies: mockMovies,
    favorites: [],
    watched: [],
    customMovies: [],
    isLoading: false,
    moviesFetchError: null,
    toggleFavorite: mockToggleFavorite,
    toggleWatched: mockToggleWatched,
    getMovieVideo: mockGetMovieVideo,
    deleteMovie: vi.fn(),
    fetchMovies: vi.fn(),
    fetchCustomMovies: vi.fn(),
    clearFavorites: vi.fn(),
  };

  const combinedValue = { ...filterValue, ...dataValue };

  return render(
    <MemoryRouter>
      <AuthContext.Provider value={authStub}>
        <NotificationContext.Provider
          value={{ notify: mockNotify, notifications: [], removeNotification: vi.fn() }}
        >
          <MovieDataContext.Provider value={dataValue}>
            <MovieFilterContext.Provider value={filterValue}>
              <MovieContext.Provider value={combinedValue}>{component}</MovieContext.Provider>
            </MovieFilterContext.Provider>
          </MovieDataContext.Provider>
        </NotificationContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Интеграционное тестирование: Страница списка фильмов (MoviesPage)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('1. Полный цикл: Рендер списка и открытие модального окна', async () => {
    renderWithContext(<MoviesPage />);

    expect(screen.getByText('Inception')).toBeInTheDocument();
    
    const movieTitle = screen.getByText('Inception');
    fireEvent.click(movieTitle);

    await waitFor(() => {
      expect(screen.getByText('Сон внутри сна')).toBeInTheDocument();
    });
  });

  test('2. Взаимодействие: Пагинация (переключение страниц)', () => {
    renderWithContext(<MoviesPage />);

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    expect(mockSetPage).toHaveBeenCalledWith(2);
    expect(mockSetPage).toHaveBeenCalledTimes(1);
  });
});