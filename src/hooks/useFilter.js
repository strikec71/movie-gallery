import { useMemo } from 'react';

export const useFilter = (movies, { searchQuery, selectedGenres, sortBy, sortOrder }) => {
  return useMemo(() => {
    if (!movies) return [];

    let filtered = [...movies];

    // 1. Поиск (локальная фильтрация для страниц Избранное/Просмотрено)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.title?.toLowerCase().includes(query) || 
        m.originalTitle?.toLowerCase().includes(query)
      );
    }

    // 2. Жанры (совпадение по названиям с большой буквы)
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(m => 
        selectedGenres.every(genre => m.genres?.includes(genre))
      );
    }

    // 3. Сортировка
    filtered.sort((a, b) => {
      let valA, valB;

      switch (sortBy) {
        case 'rating':
          valA = parseFloat(a.rating || 0);
          valB = parseFloat(b.rating || 0);
          break;
        case 'imdb':
          // Если у одного из фильмов нет рейтинга IMDb, он уйдет в конец списка
          valA = parseFloat(a.ratingImdb || 0);
          valB = parseFloat(b.ratingImdb || 0);
          break;
        case 'popularity':
          // Сортировка по количеству голосов (настоящий хайп)
          valA = parseInt(a.popularity || 0);
          valB = parseInt(b.popularity || 0);
          break;
        case 'date':
          valA = parseInt(a.year || 0);
          valB = parseInt(b.year || 0);
          break;
        case 'title':
          valA = (a.title || "").toLowerCase();
          valB = (b.title || "").toLowerCase();
          break;
        default:
          valA = a.id;
          valB = b.id;
      }

      if (valA < valB) return sortOrder === 'desc' ? 1 : -1;
      if (valA > valB) return sortOrder === 'desc' ? -1 : 1;
      return 0;
    });

    return filtered;
  }, [movies, searchQuery, selectedGenres, sortBy, sortOrder]);
};