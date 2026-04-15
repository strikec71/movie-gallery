import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest'; 
import MovieListWrapper from '../../components/MovieListWrapper';

const mockMovies = [
  { id: 1, title: 'Inception', rating: 8.8 },
  { id: 2, title: 'Interstellar', rating: 8.6 }
];

describe('Тестирование паттерна Render Props: MovieListWrapper', () => {
  
  test('Должен вызывать функцию render для каждого фильма', () => {
    const renderMock = vi.fn((movie) => <div key={movie.id} data-testid={`movie-${movie.id}`}>{movie.title}</div>);

    render(<MovieListWrapper movies={mockMovies} render={renderMock} />);

    expect(renderMock).toHaveBeenCalledTimes(2);
    expect(renderMock).toHaveBeenCalledWith(mockMovies[0]);
    expect(renderMock).toHaveBeenCalledWith(mockMovies[1]);

    expect(screen.getByTestId('movie-1')).toHaveTextContent('Inception');
    expect(screen.getByTestId('movie-2')).toHaveTextContent('Interstellar');
  });

  test('Должен отображать сообщение, если массив фильмов пуст', () => {
    const renderMock = vi.fn();
    render(<MovieListWrapper movies={[]} render={renderMock} />);
    expect(renderMock).not.toHaveBeenCalled();
  });
});