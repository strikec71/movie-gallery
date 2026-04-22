import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Импортируем все наши новые контексты
import { MovieContext, MovieDataContext, MovieFilterContext } from '../../context/MovieContext';
import { NotificationContext } from '../../context/NotificationContext';
import MoviesPage from '../MoviesPage';

const mockMovies = [
  { id: 1, title: 'Inception', rating: 8.8, description: 'Сон внутри сна' },
  { id: 2, title: 'Interstellar', rating: 8.6, description: 'Космос и черные дыры' }
];

const mockToggleFavorite = vi.fn();
const mockToggleWatched = vi.fn();
const mockSetPage = vi.fn();
const mockGetMovieVideo = vi.fn().mockResolvedValue('fake-trailer-key'); 
const mockNotify = vi.fn(); // Мок для уведомлений

const renderWithContext = (component) => {
  // 1. Создаем фейковые данные для фильтров
  const filterValue = {
    page: 1,
    totalPages: 2,
    setPage: mockSetPage,
    searchQuery: '',
    selectedGenres: [],
    sortBy: 'rating',
    sortOrder: 'desc',
  };

  // 2. Создаем фейковые данные для фильмов
  const dataValue = {
    movies: mockMovies,
    favorites: [],
    watched: [],
    customMovies: [],
    isLoading: false,
    toggleFavorite: mockToggleFavorite,
    toggleWatched: mockToggleWatched,
    getMovieVideo: mockGetMovieVideo,
  };

  const combinedValue = { ...filterValue, ...dataValue };

  return render(
    <MemoryRouter>
      {/* Оборачиваем во все новые провайдеры, как в main.jsx */}
      <NotificationContext.Provider value={{ notify: mockNotify, notifications: [], removeNotification: vi.fn() }}>
        <MovieDataContext.Provider value={dataValue}>
          <MovieFilterContext.Provider value={filterValue}>
            <MovieContext.Provider value={combinedValue}>
              {component}
            </MovieContext.Provider>
          </MovieFilterContext.Provider>
        </MovieDataContext.Provider>
      </NotificationContext.Provider>
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