import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest'; 
import MovieCard from '../../components/MovieCard';

const mockMovie = {
  id: 777,
  title: 'Матрица',
  rating: 9.5,
  posterUrl: 'https://example.com/matrix.jpg'
};

describe('Тестирование паттерна Compound Components: MovieCard', () => {
  
  test('Должен корректно собирать карточку из дочерних компонентов', () => {
    // Рендерим как есть, без фейковых кнопок внутри
    render(
      <MovieCard movie={mockMovie}>
        <MovieCard.Poster />
        <MovieCard.Info />
      </MovieCard>
    );

    // Проверяем название
    expect(screen.getByText('Матрица')).toBeInTheDocument();
    
    // Проверяем реальную кнопку, которую генерирует твой код
    expect(screen.getByTitle('В избранное')).toBeInTheDocument();
  });

  test('Должен вызывать функцию onClick при клике', () => {
    const handleClickMock = vi.fn(); 

    render(
      <MovieCard movie={mockMovie} onClick={handleClickMock}>
        <MovieCard.Info />
      </MovieCard>
    );

    const titleElement = screen.getByText('Матрица');
    fireEvent.click(titleElement);

    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });
});