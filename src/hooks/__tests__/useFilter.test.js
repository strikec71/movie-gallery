import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFilter } from '../useFilter';

const movies = [
  { id: 1, title: 'Interstellar', genres: ['Sci-Fi', 'Drama'], rating: 8.7, popularity: 95, year: '2014' },
  { id: 2, title: 'Inception', genres: ['Sci-Fi', 'Action'], rating: 8.8, popularity: 99, year: '2010' },
  { id: 3, title: 'Arrival', genres: ['Sci-Fi'], rating: 7.9, popularity: 80, year: '2016' },
];

describe('useFilter', () => {
  it('filters by search query and selected genres', () => {
    const { result } = renderHook(() =>
      useFilter(movies, {
        searchQuery: 'in',
        selectedGenres: ['Sci-Fi'],
        sortBy: 'title',
        sortOrder: 'asc',
      })
    );

    expect(result.current.map((m) => m.title)).toEqual(['Inception', 'Interstellar']);
  });

  it('sorts by rating in descending order', () => {
    const { result } = renderHook(() =>
      useFilter(movies, {
        searchQuery: '',
        selectedGenres: [],
        sortBy: 'rating',
        sortOrder: 'desc',
      })
    );

    expect(result.current[0].title).toBe('Inception');
  });
});
