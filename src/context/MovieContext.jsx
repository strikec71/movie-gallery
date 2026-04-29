import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useFilter } from '../hooks/useFilter';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';
import { supabase } from '../api/supabase';

export const MovieContext = createContext();
export const MovieDataContext = createContext();
export const MovieFilterContext = createContext();

const KP_API_KEY = '0e8f6dd8-a45a-43b0-ab92-b89e84737bee';
const KP_BASE_URL = 'https://kinopoiskapiunofficial.tech/api';

const genreIds = { 
  "Аниме": 24, "Биография": 8, "Боевик": 11, "Вестерн": 10, "Военный": 14, 
  "Детектив": 5, "Документальный": 22, "Драма": 2, "Комедия": 13, "Криминал": 3, 
  "Мелодрама": 4, "Музыка": 16, "Мультфильм": 18, "Приключения": 7, "Семейный": 19, 
  "Триллер": 1, "Ужасы": 17, "Фантастика": 6, "Фэнтези": 12 
};

export const MovieProvider = ({ children }) => {
  const { notify } = useNotification();
  const { user, setIsAuthModalOpen } = useAuth();

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState("rating"); // rating, popularity, date, imdb
  const [sortOrder, setSortOrder] = useState("desc");

  const [customMovies, setCustomMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    localStorage.removeItem('react-movie-watched');
    localStorage.removeItem('react-movie-favorites');
  }, []);

  const fetchCustomMovies = useCallback(async () => {
    const { data: dbMovies } = await supabase.from('custom_movies').select('*');
    if (dbMovies) {
      setCustomMovies(dbMovies.map(m => ({
        id: m.id, title: m.title, vote_average: m.vote_average,
        release_date: m.release_date, poster_path: m.poster_path,
        genres: m.genres || [], isCustom: true, rating: m.vote_average, year: m.release_date,
        description: m.description, popularity: 0, ratingImdb: 0
      })));
    }
  }, []);

  useEffect(() => {
    fetchCustomMovies();
    const fetchUserData = async () => {
      if (user) {
        const { data: favData } = await supabase.from('favorites').select('movie_data').eq('user_id', user.id);
        if (favData) setFavorites(favData.map(item => item.movie_data));

        const { data: watchedData } = await supabase.from('watched').select('movie_data').eq('user_id', user.id);
        if (watchedData) setWatched(watchedData.map(item => item.movie_data));
      } else {
        setFavorites([]);
        setWatched([]);
      }
    };
    fetchUserData();
  }, [user, fetchCustomMovies]);

  useEffect(() => { setPage(1); }, [searchQuery, selectedGenres, sortBy, sortOrder]);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    try {
      let url;
      
      if (searchQuery) {
        url = `${KP_BASE_URL}/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(searchQuery)}&page=${page}`;
      } else {
        // Умная сортировка для API Кинопоиска
        let kpSort = 'RATING';
        if (sortBy === "popularity") kpSort = 'NUM_VOTE'; // Сортировка по количеству голосов (хайп)
        else if (sortBy === "date") kpSort = 'YEAR';

        const genresQuery = selectedGenres.length > 0 
          ? `&genres=${selectedGenres.map(g => genreIds[g]).join(',')}` 
          : '';
          
        url = `${KP_BASE_URL}/v2.2/films?order=${kpSort}&type=FILM&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=${page}${genresQuery}`;
      }

      const response = await fetch(url, {
        headers: {
          'X-API-KEY': KP_API_KEY,
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json(); 

      setTotalPages(Math.min(data.pagesCount || data.totalPages || 1, 20)); 

      const items = data.films || data.items || [];

      const formattedMovies = items.map(item => {
        const kpId = item.kinopoiskId || item.filmId;
        return {
          id: kpId,
          title: item.nameRu || item.nameOriginal || "Без названия",
          originalTitle: item.nameOriginal || "",
          genres: item.genres ? item.genres.map(g => g.genre.charAt(0).toUpperCase() + g.genre.slice(1)).slice(0, 3) : ["Кино"],
          rating: parseFloat(item.ratingKinopoisk || item.rating || 0).toFixed(1),
          ratingImdb: item.ratingImdb ? parseFloat(item.ratingImdb).toFixed(1) : null,
          country: item.countries && item.countries.length > 0 ? item.countries[0].country : 'Неизвестно',
          
          filmLength: item.filmLength ? `${item.filmLength} мин.` : null,
          ageLimit: item.ratingAgeLimits ? item.ratingAgeLimits.replace('age', '') + '+' : null,
          slogan: item.slogan ? `«${item.slogan}»` : null,
          webUrl: item.webUrl || `https://www.kinopoisk.ru/film/${kpId}/`,

          popularity: item.ratingVoteCount || item.ratingVotes || item.votes || 0,
          language: 'RU',
          year: item.year ? String(item.year) : '0000',
          poster: item.posterUrlPreview || item.posterUrl || 'https://via.placeholder.com/500x750/181a20/8b9bb4?text=Нет+постера',
          description: item.description || item.shortDescription || "Описание отсутствует.",
        };
      });

      setMovies(formattedMovies);
    } catch (error) {
      console.error("Ошибка API Кинопоиска:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, selectedGenres, sortBy]);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  const getMovieVideo = useCallback(async (movieId) => {
    if (customMovies.some(m => String(m.id) === String(movieId))) return null; 
    try {
      const response = await fetch(`${KP_BASE_URL}/v2.2/films/${movieId}/videos`, {
        headers: { 'X-API-KEY': KP_API_KEY, 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      const trailer = data.items?.find(vid => vid.site === "YOUTUBE" || vid.url?.includes('youtube'));
      if (trailer && trailer.url) {
        const match = trailer.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        return match ? match[1] : null;
      }
      return null;
    } catch (error) { return null; }
  }, [customMovies]);

  const toggleFavorite = useCallback(async (movieId) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    const movieIdString = String(movieId);
    const isExist = favorites.find(f => String(f?.id || f) === movieIdString);

    if (isExist) {
      setFavorites(prev => prev.filter(f => String(f?.id || f) !== movieIdString));
      await supabase.from('favorites').delete().match({ user_id: user.id, movie_id: movieIdString });
    } else {
      const movieObj = [...movies, ...customMovies, ...watched, ...favorites].find(m => String(m?.id || m) === movieIdString);
      if (!movieObj) return;
      setFavorites(prev => [...prev, movieObj]);
      await supabase.from('favorites').insert([{ user_id: user.id, movie_id: movieIdString, movie_data: movieObj }]);
    }
  }, [user, favorites, watched, movies, customMovies, setIsAuthModalOpen]);

  const toggleWatched = useCallback(async (movieId) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    const movieIdString = String(movieId);
    const isExist = watched.find(w => String(w?.id || w) === movieIdString);

    if (isExist) {
      setWatched(prev => prev.filter(w => String(w?.id || w) !== movieIdString));
      await supabase.from('watched').delete().match({ user_id: user.id, movie_id: movieIdString });
    } else {
      const movieObj = [...movies, ...customMovies, ...favorites, ...watched].find(m => String(m?.id || m) === movieIdString);
      if (!movieObj) return;
      setWatched(prev => [...prev, movieObj]);
      await supabase.from('watched').insert([{ user_id: user.id, movie_id: movieIdString, movie_data: movieObj }]);
    }
  }, [user, watched, favorites, movies, customMovies, setIsAuthModalOpen]);

  const clearFavorites = useCallback(async () => {
    if (!user) return;
    setFavorites([]);
    await supabase.from('favorites').delete().eq('user_id', user.id);
  }, [user]);

  const addMovie = useCallback(() => {}, []); 
  const updateMovie = useCallback(() => {}, []);
  
  const deleteMovie = useCallback(async (movieId) => {
    const { error } = await supabase.from('custom_movies').delete().eq('id', movieId);
    if (error) { notify({ type: 'error', message: 'Ошибка при удалении' }); return; }
    setCustomMovies(prev => prev.filter(m => m.id !== movieId));
    setFavorites(prev => prev.filter(f => String(f?.id || f) !== String(movieId)));
    setWatched(prev => prev.filter(w => String(w?.id || w) !== String(movieId))); 
    notify({ type: 'info', message: 'Удалено.' });
  }, [notify]);

  const combinedMovies = useMemo(() => [...customMovies, ...movies], [customMovies, movies]);
  const sortedMovies = useFilter(combinedMovies, { searchQuery, selectedGenres, sortBy, sortOrder });
  const sortedFavorites = useFilter(favorites, { searchQuery, selectedGenres, sortBy, sortOrder });

  const dataValue = useMemo(() => ({
    movies: sortedMovies, favorites: sortedFavorites, watched, customMovies, isLoading,
    toggleFavorite, toggleWatched, clearFavorites, fetchMovies, fetchCustomMovies,
    getMovieVideo, addMovie, deleteMovie, updateMovie,
  }), [sortedMovies, sortedFavorites, watched, customMovies, isLoading, toggleFavorite, toggleWatched, clearFavorites, fetchMovies, fetchCustomMovies, getMovieVideo, addMovie, deleteMovie, updateMovie]);

  const filterValue = useMemo(() => ({
    page, setPage, totalPages, searchQuery, setSearchQuery, selectedGenres, setSelectedGenres, sortBy, setSortBy, sortOrder, setSortOrder,
  }), [page, totalPages, searchQuery, selectedGenres, sortBy, sortOrder]);

  const value = useMemo(() => ({ ...dataValue, ...filterValue }), [dataValue, filterValue]);

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