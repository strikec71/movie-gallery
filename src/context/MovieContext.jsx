import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useFilter } from '../hooks/useFilter';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';
import { supabase } from '../api/supabase';

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
  const { user, setIsAuthModalOpen } = useAuth();

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

  const { loading: isLoading, request } = useFetch();

  const [customMovies, setCustomMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watched, setWatched] = useState([]); // Очистили от localStorage, теперь пустой массив по умолчанию

  const fetchCustomMovies = useCallback(async () => {
    const { data: dbMovies } = await supabase.from('custom_movies').select('*');
    if (dbMovies) {
      setCustomMovies(dbMovies.map(m => ({
        id: m.id, title: m.title, vote_average: m.vote_average,
        release_date: m.release_date, poster_path: m.poster_path,
        genres: m.genres || [], isCustom: true, rating: m.vote_average, year: m.release_date,
        description: m.description
      })));
    }
  }, []);

  useEffect(() => {
    fetchCustomMovies();

    const fetchUserData = async () => {
      if (user) {
        // Загружаем Избранное
        const { data: favData } = await supabase.from('favorites').select('movie_data').eq('user_id', user.id);
        if (favData) {
          setFavorites(favData.map(item => item.movie_data));
        }

        // Загружаем Просмотренное
        const { data: watchedData } = await supabase.from('watched').select('movie_data').eq('user_id', user.id);
        if (watchedData) {
          setWatched(watchedData.map(item => item.movie_data));
        }
      } else {
        // Если вышел - очищаем
        setFavorites([]);
        setWatched([]);
      }
    };
    fetchUserData();
  }, [user, fetchCustomMovies]);

  useEffect(() => { setPage(1); }, [searchQuery, selectedGenres, sortBy, sortOrder]);

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

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  const getMovieVideo = useCallback(async (movieId) => {
    if (customMovies.some(m => m.id === movieId)) return null; 
    try {
      const data = await request(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=ru-RU`);
      const trailer = data.results?.find(vid => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser"));
      return trailer ? trailer.key : null;
    } catch (error) { return null; }
  }, [customMovies, request]);

  const toggleFavorite = useCallback(async (movieId) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const movieIdString = String(movieId);
    const isExist = favorites.find(f => String(f.id) === movieIdString);

    if (isExist) {
      setFavorites(prev => prev.filter(f => String(f.id) !== movieIdString));
      await supabase.from('favorites').delete().match({ user_id: user.id, movie_id: movieIdString });
    } else {
      const movieObj = [...movies, ...customMovies].find(m => String(m.id) === movieIdString);
      if (!movieObj) return;

      setFavorites(prev => [...prev, movieObj]);
      await supabase.from('favorites').insert([{ user_id: user.id, movie_id: movieIdString, movie_data: movieObj }]);
    }
  }, [user, favorites, movies, customMovies, setIsAuthModalOpen]);

  const toggleWatched = useCallback(async (movieId) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const movieIdString = String(movieId);
    const isExist = watched.find(w => String(w.id) === movieIdString);

    if (isExist) {
      setWatched(prev => prev.filter(w => String(w.id) !== movieIdString));
      await supabase.from('watched').delete().match({ user_id: user.id, movie_id: movieIdString });
    } else {
      const movieObj = [...movies, ...customMovies].find(m => String(m.id) === movieIdString);
      if (!movieObj) return;

      setWatched(prev => [...prev, movieObj]);
      await supabase.from('watched').insert([{ user_id: user.id, movie_id: movieIdString, movie_data: movieObj }]);
    }
  }, [user, watched, movies, customMovies, setIsAuthModalOpen]);

  const clearFavorites = useCallback(async () => {
    if (!user) return;
    setFavorites([]);
    await supabase.from('favorites').delete().eq('user_id', user.id);
  }, [user]);

  const addMovie = useCallback(() => {}, []); 
  const updateMovie = useCallback(() => {}, []);
  
  const deleteMovie = useCallback(async (movieId) => {
    const { error } = await supabase
      .from('custom_movies')
      .delete()
      .eq('id', movieId);

    if (error) {
      console.error('Ошибка удаления:', error);
      notify({ type: 'error', message: 'Ошибка при удалении из БД' });
      return;
    }

    setCustomMovies(prev => prev.filter(m => m.id !== movieId));
    setFavorites(prev => prev.filter(f => String(f.id) !== String(movieId)));
    setWatched(prev => prev.filter(w => String(w.id) !== String(movieId))); // Очищаем и из просмотренных!
    
    notify({ type: 'info', message: 'Фильм навсегда удален из базы.' });
  }, [notify]);

  const combinedMovies = useMemo(() => [...customMovies, ...movies], [customMovies, movies]);
  const sortedMovies = useFilter(combinedMovies, { searchQuery, selectedGenres, sortBy, sortOrder });
  const sortedFavorites = useFilter(favorites, { searchQuery, selectedGenres, sortBy, sortOrder });

  const dataValue = useMemo(() => ({
    movies: sortedMovies,
    favorites: sortedFavorites,
    watched,
    customMovies,
    isLoading: isLoading,
    toggleFavorite,
    toggleWatched,
    clearFavorites,
    fetchMovies,
    fetchCustomMovies,
    getMovieVideo,
    addMovie,
    deleteMovie,
    updateMovie,
  }), [sortedMovies, sortedFavorites, watched, customMovies, isLoading, toggleFavorite, toggleWatched, clearFavorites, fetchMovies, fetchCustomMovies, getMovieVideo, addMovie, deleteMovie, updateMovie]);

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