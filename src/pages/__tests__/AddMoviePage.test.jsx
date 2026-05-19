import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddMoviePage from '../AddMoviePage';
import { MovieContext } from '../../context/MovieContext';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user' },
    isAdmin: true,
    loading: false,
  }),
}));

const renderWithProviders = (component) => {
  return render(
    <MovieContext.Provider value={{ fetchCustomMovies: vi.fn() }}>
      <MemoryRouter>{component}</MemoryRouter>
    </MovieContext.Provider>
  );
};

describe('Тестирование компонента AddMoviePage', () => {
  it('Должен показывать ошибку валидации при коротком названии', () => {
    renderWithProviders(<AddMoviePage />);

    const titleInputs = screen.getAllByRole('textbox');
    const titleInput = titleInputs[0];

    fireEvent.change(titleInput, { target: { name: 'title', value: 'А' } });
    fireEvent.blur(titleInput);

    expect(screen.getByText('Минимум 3 символа')).toBeInTheDocument();
  });
});
