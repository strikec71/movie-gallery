import { useMemo } from 'react';

export const useFilter = (items, { searchQuery, selectedGenres, sortBy, sortOrder }) => {
  return useMemo(() => {
    let result = [...(items || [])];

    if (searchQuery) {
      result = result.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedGenres?.length > 0) {
      result = result.filter(item => selectedGenres.every(g => item.genres?.includes(g)));
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "popularity": comparison = a.popularity - b.popularity; break;
        case "rating": comparison = a.rating - b.rating; break;
        case "date": comparison = parseInt(a.year) - parseInt(b.year); break;
        case "title": comparison = a.title.localeCompare(b.title); break;
        default: comparison = 0;
      }
      return sortOrder === "asc" ? comparison : comparison * -1;
    });

    return result;
  }, [items, searchQuery, selectedGenres, sortBy, sortOrder]);
};