import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useFilter } from '../hooks/useFilter';
import { mockMoviesApi } from '../api/mockMoviesApi';
import { useNotification } from './NotificationContext';

export const MovieContext = createContext();
export const MovieDataContext = createContext();
export const MovieFilterContext = createContext();

const API_KEY = 'ded1b945602b2d2c94a4461084556610';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const genreMap = { 28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western" };
const genreIds = { "Action": 28, "Adventure": 12, "Animation": 16, "Comedy": 35, "Crime": 80, "Documentary": 99, "Drama": 18, "Family": 10751, "Fantasy": 14, "History": 36, "Horror": 27, "Music": 10402, "Mystery": 9648, "Romance": 10749, "Sci-Fi": 878, "Thriller": 53, "War": 10752, "Western": 37 };

export const MovieProvider = ({ children }) => {
  const { notify } = useNotification();

  // --- 2FA AUTHENTICATION STATE ---
  const [authStatus, setAuthStatus] = useState(() => {
    return localStorage.getItem('movie-gallery-auth-status') || 'logged_out';
  });

  useEffect(() => {
    localStorage.setItem('movie-gallery-auth-status', authStatus);
  }, [authStatus]);

  const loginStep1 = useCallback((email, password) => {
    if (email === 'admin@mail.com' && password === '12345') {
      setAuthStatus('pending_2fa');
      notify({ type: 'info', message: 'Код отправлен на почту. Введите 0000' });
    } else {
      notify({ type: 'error', message: 'Неверный email или пароль' });
    }
  }, [notify]);

  const loginStep2_2FA = useCallback((code) => {
    if (code === '0000') {
      setAuthStatus('authenticated');
      notify({ type: 'success', message: 'Успешный вход в систему!' });
    } else {
      notify({ type: 'error', message: 'Неверный код 2FA!' });
    }
  }, [notify]);

  const logout = useCallback(() => {
    setAuthStatus('logged_out');
    notify({ type: 'info', message: 'Вы вышли из системы' });
  }, [notify]);
  // --------------------------------

  // Remote catalog state (TMDB).
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

  const { loading: isLoading, request } = useFetch();
  const { loading: isMutating, execute } = useFetch();

  // Local user collections persisted in localStorage.
  const [customMovies, setCustomMovies] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('react-movie-favorites')) || []; } catch { return []; }
  });
  const [watched, setWatched] = useState(() => {
    try { return JSON.parse(localStorage.getItem('react-movie-watched')) || []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('react-movie-favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('react-movie-watched', JSON.stringify(watched)); }, [watched]);

  useEffect(() => {
    let isActive = true;
    execute(() => mockMoviesApi.getAll())
      .then((items) => {
        if (isActive) setCustomMovies(items);
      })
      .catch(() => {
        notify({ type: 'error', message: 'Failed to load local collection.' });
      });
    return () => {
      isActive = false;
    };
  }, [execute, notify]);

  useEffect(() => { 
    setPage(1); 
  }, [searchQuery, selectedGenres, sortBy, sortOrder]);

  const fetchMovies = useCallback(async () => {
    try {
      let tmdbSort = "popularity.desc";
      if (sortBy === "rating") tmdbSort = `vote_average.${sortOrder}`;
      else if (sortBy === "date") tmdbSort = `primary_release_date.${sortOrder}`;
      else if (sortBy === "title") tmdbSort = `original_title.${sortOrder}`;
      else if (sortBy === "popularity") tmdbSort = `popularity.${sortOrder}`;
      
      const minVotes = sortBy === "rating" ? "&vote_count.gte=100" : "";

      let url = searchQuery 
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchQuery}&language=ru-RU&page=${page}`
        : `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ru-RU&page=${page}&sort_by=${tmdbSort}${minVotes}${selectedGenres.length > 0 ? `&with_genres=${selectedGenres.map(g => genreIds[g]).join(',')}` : ''}`;

      const data = await request(url); 
      setTotalPages(Math.min(data.total_pages, 500)); 

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
    } catch (error) {
      console.error("Ошибка API:", error);
      notify({ type: 'error', message: 'Failed to load movies from API.' });
    }
  }, [page, searchQuery, selectedGenres, sortBy, sortOrder, request, notify]);

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

  const addMovie = useCallback(async (newMovie, isWatchedFlag) => {
    const createdMovie = await execute(() => mockMoviesApi.create(newMovie));
    setCustomMovies(prev => [createdMovie, ...prev]);
    if (isWatchedFlag) setWatched(prev => [...prev, createdMovie.id]);
    notify({ type: 'success', message: 'Movie added to your collection.' });
  }, [execute, notify]);

  const updateMovie = useCallback(async (updatedMovie) => {
    const savedMovie = await execute(() => mockMoviesApi.update(updatedMovie));
    setCustomMovies(prev => prev.map(m => m.id === savedMovie.id ? savedMovie : m));
    setFavorites(prev => prev.map(f => f.id === savedMovie.id ? savedMovie : f));
    notify({ type: 'success', message: 'Movie changes saved.' });
  }, [execute, notify]);

  const deleteMovie = useCallback(async (movieId) => {
    await execute(() => mockMoviesApi.remove(movieId));
    setCustomMovies(prev => prev.filter(m => m.id !== movieId));
    setFavorites(prev => prev.filter(f => f.id !== movieId));
    setWatched(prev => prev.filter(id => id !== movieId));
    notify({ type: 'info', message: 'Movie removed from your collection.' });
  }, [execute, notify]);

  const combinedMovies = useMemo(() => [...customMovies, ...movies], [customMovies, movies]);
  const sortedMovies = useFilter(combinedMovies, { searchQuery, selectedGenres, sortBy, sortOrder });
  const sortedFavorites = useFilter(favorites, { searchQuery, selectedGenres, sortBy, sortOrder });

  const dataValue = useMemo(() => ({
    movies: sortedMovies,
    favorites: sortedFavorites,
    watched,
    customMovies,
    isLoading: isLoading || isMutating,
    toggleFavorite,
    toggleWatched,
    clearFavorites,
    fetchMovies,
    getMovieVideo,
    addMovie,
    deleteMovie,
    updateMovie,
    // Экспортируем auth-сущности:
    authStatus, loginStep1, loginStep2_2FA, logout
  }), [sortedMovies, sortedFavorites, watched, customMovies, isLoading, isMutating, toggleFavorite, toggleWatched, clearFavorites, fetchMovies, getMovieVideo, addMovie, deleteMovie, updateMovie, authStatus, loginStep1, loginStep2_2FA, logout]);

  const filterValue = useMemo(() => ({
    page, setPage, totalPages, searchQuery, setSearchQuery, selectedGenres, setSelectedGenres, sortBy, setSortBy, sortOrder, setSortOrder,
  }), [page, totalPages, searchQuery, selectedGenres, sortBy, sortOrder]);

  const value = useMemo(() => ({
    ...dataValue, ...filterValue
  }), [dataValue, filterValue]);

  return (
    <MovieDataContext.Provider value={dataValue}>
      <MovieFilterContext.Provider value={filterValue}>
        <MovieContext.Provider value={value}>
          {children}
        </MovieContext.Provider>
      </MovieFilterContext.Provider>
    </MovieDataContext.Provider>
  );
};