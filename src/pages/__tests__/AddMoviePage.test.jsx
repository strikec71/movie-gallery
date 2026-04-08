import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddMoviePage from '../AddMoviePage';
import { MovieContext } from '../../context/MovieContext';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

const renderWithProviders = (component) => {
  return render(
    <MovieContext.Provider value={{ addMovie: vi.fn() }}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </MovieContext.Provider>
  );
};

describe('Тестирование компонента AddMoviePage', () => {
  it('Должен показывать ошибку валидации при коротком названии', () => {
    renderWithProviders(<AddMoviePage />);
    
    //Comment
    // Находим инпут по placeholder (убедись, что в твоем компоненте есть такой placeholder)
    // Если плейсхолдер другой, замени текст здесь
    const titleInputs = screen.getAllByRole('textbox');
    const titleInput = titleInputs[0]; // Первое текстовое поле обычно title
    
    // Вводим 1 символ и убираем фокус (onBlur)
    fireEvent.change(titleInput, { target: { name: 'title', value: 'А' } });
    fireEvent.blur(titleInput);
    
    // Должна появиться ошибка
    expect(screen.getByText('Минимум 3 символа')).toBeInTheDocument();
  });
});