import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useFilter } from '../hooks/useFilter';

export const MovieContext = createContext();

const API_KEY = 'ded1b945602b2d2c94a4461084556610';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const genreMap = { 28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western" };
const genreIds = { "Action": 28, "Adventure": 12, "Animation": 16, "Comedy": 35, "Crime": 80, "Documentary": 99, "Drama": 18, "Family": 10751, "Fantasy": 14, "History": 36, "Horror": 27, "Music": 10402, "Mystery": 9648, "Romance": 10749, "Sci-Fi": 878, "Thriller": 53, "War": 10752, "Western": 37 };

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

  const { loading: isLoading, request } = useFetch(); 

  const [customMovies, setCustomMovies] = useState(() => {
    try { return JSON.parse(localStorage.getItem('react-movie-custom')) || []; } catch { return []; }
  });
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('react-movie-favorites')) || []; } catch { return []; }
  });
  const [watched, setWatched] = useState(() => {
    try { return JSON.parse(localStorage.getItem('react-movie-watched')) || []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('react-movie-custom', JSON.stringify(customMovies)); }, [customMovies]);
  useEffect(() => { localStorage.setItem('react-movie-favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('react-movie-watched', JSON.stringify(watched)); }, [watched]);

  // 1. ИСПРАВЛЕНИЕ ПАГИНАЦИИ (Разделили эффекты)
  // Сбрасываем страницу на 1-ю ТОЛЬКО при изменении параметров фильтра, а не при клике на пагинацию
  useEffect(() => { 
    setPage(1); 
  }, [searchQuery, selectedGenres, sortBy, sortOrder]);

  const fetchMovies = useCallback(async () => {
    try {
      // 2. ИСПРАВЛЕНИЕ ГЛОБАЛЬНОЙ СОРТИРОВКИ
      // Преобразуем наш стейт sortBy в формат, который понимает TMDB
      let tmdbSort = "popularity.desc";
      if (sortBy === "rating") tmdbSort = `vote_average.${sortOrder}`;
      else if (sortBy === "date") tmdbSort = `primary_release_date.${sortOrder}`;
      else if (sortBy === "title") tmdbSort = `original_title.${sortOrder}`;
      else if (sortBy === "popularity") tmdbSort = `popularity.${sortOrder}`;
      
      // Чтобы TMDB не выдавал на 1 странице фильмы с рейтингом 10/10, у которых всего 1 голос:
      const minVotes = sortBy === "rating" ? "&vote_count.gte=100" : "";

      let url = searchQuery 
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchQuery}&language=ru-RU&page=${page}`
        : `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ru-RU&page=${page}&sort_by=${tmdbSort}${minVotes}${selectedGenres.length > 0 ? `&with_genres=${selectedGenres.map(g => genreIds[g]).join(',')}` : ''}`;

      const data = await request(url); 
      setTotalPages(Math.min(data.total_pages, 500)); // TMDB лимитирует API 500 страницами

      const formattedMovies = data.results.map(item => ({
        id: item.id, title: item.title, originalTitle: item.original_title,
        genres: item.genre_ids ? item.genre_ids.map(id => genreMap[id]).filter(Boolean) : ["Кино"],
        rating: parseFloat(item.vote_average), popularity: Math.round(item.popularity),
        language: item.original_language ? item.original_language.toUpperCase() : 'EN',
        year: item.release_date ? item.release_date.substring(0, 4) : '0000',
        poster: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/500x750/181a20/8b9bb4?text=Нет+постера',
        description: item.overview || "Описание отсутствует.",
      }));
      setMovies(formattedMovies);
    } catch (error) { console.error("Ошибка API:", error); }
  }, [page, searchQuery, selectedGenres, sortBy, sortOrder, request]);

  // Запрашиваем фильмы, когда меняется функция fetch (то есть при изменении page, фильтров и т.д.)
  useEffect(() => { 
    fetchMovies(); 
  }, [fetchMovies]);

  const getMovieVideo = useCallback(async (movieId) => {
    if (customMovies.some(m => m.id === movieId)) return null; 
    try {
      const data = await request(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=ru-RU`);
      const trailer = data.results?.find(vid => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser"));
      return trailer ? trailer.key : null;
    } catch (error) { return null; }
  }, [customMovies, request]);

  const toggleFavorite = useCallback((movieId) => {
    setFavorites(prev => prev.some(fav => fav.id === movieId) ? prev.filter(fav => fav.id !== movieId) : [...prev, [...movies, ...customMovies].find(m => m.id === movieId)].filter(Boolean));
  }, [movies, customMovies]);

  const toggleWatched = useCallback((movieId) => {
    setWatched(prev => prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]);
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const addMovie = useCallback((newMovie, isWatchedFlag) => {
    setCustomMovies(prev => [newMovie, ...prev]);
    if (isWatchedFlag) setWatched(prev => [...prev, newMovie.id]); 
  }, []);

  const updateMovie = useCallback((updatedMovie) => {
    setCustomMovies(prev => prev.map(m => m.id === updatedMovie.id ? updatedMovie : m));
    setFavorites(prev => prev.map(f => f.id === updatedMovie.id ? updatedMovie : f));
  }, []);

  const deleteMovie = useCallback((movieId) => {
    setCustomMovies(prev => prev.filter(m => m.id !== movieId));
    setFavorites(prev => prev.filter(f => f.id !== movieId));
    setWatched(prev => prev.filter(id => id !== movieId));
  }, []);

  const combinedMovies = useMemo(() => [...customMovies, ...movies], [customMovies, movies]);

  // useFilter теперь просто вставляет customMovies в нужные места среди глобально отсортированных 20 фильмов
  const sortedMovies = useFilter(combinedMovies, { searchQuery, selectedGenres, sortBy, sortOrder });
  const sortedFavorites = useFilter(favorites, { searchQuery, selectedGenres, sortBy, sortOrder });

  const value = useMemo(() => ({
    movies: sortedMovies, favorites: sortedFavorites, watched, customMovies, isLoading,
    page, setPage, totalPages, searchQuery, setSearchQuery, selectedGenres, setSelectedGenres,
    sortBy, setSortBy, sortOrder, setSortOrder, toggleFavorite, toggleWatched, clearFavorites,
    fetchMovies, getMovieVideo, addMovie, deleteMovie, updateMovie
  }), [sortedMovies, sortedFavorites, watched, customMovies, isLoading, page, totalPages, searchQuery, selectedGenres, sortBy, sortOrder, toggleFavorite, toggleWatched, clearFavorites, fetchMovies, getMovieVideo, addMovie, deleteMovie, updateMovie]);

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};