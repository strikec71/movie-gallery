import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { MovieContext } from '../../context/MovieContext';
import MoviesPage from '../MoviesPage';

const mockMovies = [
  { id: 1, title: 'Inception', rating: 8.8, description: 'Сон внутри сна' },
  { id: 2, title: 'Interstellar', rating: 8.6, description: 'Космос и черные дыры' }
];

const mockToggleFavorite = vi.fn();
const mockToggleWatched = vi.fn();
const mockSetPage = vi.fn();
const mockGetMovieVideo = vi.fn().mockResolvedValue('fake-trailer-key'); 
const mockDeleteMovie = vi.fn();

const renderWithContext = (component) => {
  return render(
    <MemoryRouter>
      <MovieContext.Provider value={{
        movies: mockMovies,
        isLoading: false,
        page: 1,
        totalPages: 2, // Установили 2 страницы, чтобы появилась кнопка пагинации
        setPage: mockSetPage,
        favorites: [],
        toggleFavorite: mockToggleFavorite,
        watched: [],
        toggleWatched: mockToggleWatched,
        selectedGenres: [],
        searchQuery: '',
        sortBy: 'rating',
        getMovieVideo: mockGetMovieVideo,
        customMovies: [],
        deleteMovie: mockDeleteMovie
      }}>
        {component}
      </MovieContext.Provider>
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

    // Так как мы передали totalPages: 2, на странице должна быть кнопка с цифрой "2"
    const page2Button = screen.getByText('2');
    
    // Кликаем по ней
    fireEvent.click(page2Button);

    // Проверяем, что функция setPage была вызвана для перехода на 2-ю страницу
    expect(mockSetPage).toHaveBeenCalledWith(2);
    expect(mockSetPage).toHaveBeenCalledTimes(1);
  });
});