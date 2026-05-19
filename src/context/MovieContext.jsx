import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useFilter } from '../hooks/useFilter';
import { useFetch } from '../hooks/useFetch';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';
import { supabase } from '../api/supabase';
import {
  buildKinopoiskCatalogUrl,
  parseKinopoiskCatalogResponse,
  fetchYoutubeTrailerId,
  getKinopoiskApiKey,
} from '../api/kinopoisk';

export const MovieContext = createContext();
export const MovieDataContext = createContext();
export const MovieFilterContext = createContext();

export const MovieProvider = ({ children }) => {
  const { notify } = useNotification();
  const { user, setIsAuthModalOpen, isAdmin } = useAuth();
  const { request, loading: catalogRequestLoading, error: requestError } = useFetch();

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');

  const [customMovies, setCustomMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watched, setWatched] = useState([]);
  /** Ошибка конфигурации (нет ключа) или последняя ошибка HTTP из useFetch */
  const [localCatalogError, setLocalCatalogError] = useState(null);

  const fetchCustomMovies = useCallback(async () => {
    const { data: dbMovies, error } = await supabase.from('custom_movies').select('*');
    if (error) {
      console.error('Supabase custom_movies:', error);
      notify({ type: 'error', message: 'Не удалось загрузить пользовательские фильмы.' });
      return;
    }
    if (dbMovies) {
      setCustomMovies(
        dbMovies.map((m) => ({
          id: m.id,
          title: m.title,
          vote_average: m.vote_average,
          release_date: m.release_date,
          poster_path: m.poster_path,
          poster:
            m.poster_path ||
            'https://via.placeholder.com/500x750/181a20/8b9bb4?text=Нет+постера',
          genres: m.genres || [],
          isCustom: true,
          rating: m.vote_average,
          year: m.release_date,
          description: m.description,
          popularity: 0,
          ratingImdb: 0,
        }))
      );
    }
  }, [notify]);

  useEffect(() => {
    fetchCustomMovies();
    const fetchUserData = async () => {
      if (user) {
        const { data: favData, error: favErr } = await supabase
          .from('favorites')
          .select('movie_data')
          .eq('user_id', user.id);
        if (favErr) {
          console.error('Supabase favorites:', favErr);
          notify({ type: 'error', message: 'Не удалось загрузить избранное.' });
        } else if (favData) {
          setFavorites(favData.map((item) => item.movie_data));
        }

        const { data: watchedData, error: watchErr } = await supabase
          .from('watched')
          .select('movie_data')
          .eq('user_id', user.id);
        if (watchErr) {
          console.error('Supabase watched:', watchErr);
          notify({ type: 'error', message: 'Не удалось загрузить просмотренные.' });
        } else if (watchedData) {
          setWatched(watchedData.map((item) => item.movie_data));
        }
      } else {
        setFavorites([]);
        setWatched([]);
      }
    };
    fetchUserData();
  }, [user, fetchCustomMovies, notify]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedGenres, sortBy, sortOrder]);

  const fetchMovies = useCallback(async () => {
    const apiKey = getKinopoiskApiKey();
    if (!apiKey) {
      const msg =
        'Задайте VITE_KINOPOISK_API_KEY в .env.local — без ключа каталог недоступен.';
      setLocalCatalogError(msg);
      setMovies([]);
      setTotalPages(0);
      return;
    }

    setLocalCatalogError(null);

    const url = buildKinopoiskCatalogUrl({ page, searchQuery, selectedGenres, sortBy });

    try {
      const data = await request(url, {
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
      });
      const { movies: nextMovies, totalPages: nextTotal } = parseKinopoiskCatalogResponse(data);
      setMovies(nextMovies);
      setTotalPages(nextTotal);
    } catch {
      notify({
        type: 'error',
        message: 'Не удалось загрузить каталог фильмов. Проверьте сеть и ключ API.',
      });
      setMovies([]);
      setTotalPages(0);
    }
  }, [page, searchQuery, selectedGenres, sortBy, request, notify]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const getMovieVideo = useCallback(
    async (movieId) => {
      if (customMovies.some((m) => String(m.id) === String(movieId))) return null;
      const apiKey = getKinopoiskApiKey();
      if (!apiKey) return null;
      try {
        return await fetchYoutubeTrailerId(movieId, apiKey);
      } catch {
        return null;
      }
    },
    [customMovies]
  );

  const toggleFavorite = useCallback(
    async (movieId) => {
      if (!user) {
        setIsAuthModalOpen(true);
        return;
      }
      const movieIdString = String(movieId);
      const isExist = favorites.find((f) => String(f?.id || f) === movieIdString);

      if (isExist) {
        setFavorites((prev) => prev.filter((f) => String(f?.id || f) !== movieIdString));
        const { error } = await supabase
          .from('favorites')
          .delete()
          .match({ user_id: user.id, movie_id: movieIdString });
        if (error) notify({ type: 'error', message: 'Не удалось убрать из избранного.' });
      } else {
        const movieObj = [...movies, ...customMovies, ...watched, ...favorites].find(
          (m) => String(m?.id || m) === movieIdString
        );
        if (!movieObj) return;
        setFavorites((prev) => [...prev, movieObj]);
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, movie_id: movieIdString, movie_data: movieObj }]);
        if (error) {
          setFavorites((prev) => prev.filter((f) => String(f?.id || f) !== movieIdString));
          notify({ type: 'error', message: 'Не удалось добавить в избранное.' });
        }
      }
    },
    [user, favorites, watched, movies, customMovies, setIsAuthModalOpen, notify]
  );

  const toggleWatched = useCallback(
    async (movieId) => {
      if (!user) {
        setIsAuthModalOpen(true);
        return;
      }
      const movieIdString = String(movieId);
      const isExist = watched.find((w) => String(w?.id || w) === movieIdString);

      if (isExist) {
        setWatched((prev) => prev.filter((w) => String(w?.id || w) !== movieIdString));
        const { error } = await supabase
          .from('watched')
          .delete()
          .match({ user_id: user.id, movie_id: movieIdString });
        if (error) notify({ type: 'error', message: 'Не удалось обновить «Просмотрено».' });
      } else {
        const movieObj = [...movies, ...customMovies, ...favorites, ...watched].find(
          (m) => String(m?.id || m) === movieIdString
        );
        if (!movieObj) return;
        setWatched((prev) => [...prev, movieObj]);
        const { error } = await supabase
          .from('watched')
          .insert([{ user_id: user.id, movie_id: movieIdString, movie_data: movieObj }]);
        if (error) {
          setWatched((prev) => prev.filter((w) => String(w?.id || w) !== movieIdString));
          notify({ type: 'error', message: 'Не удалось отметить как просмотренное.' });
        }
      }
    },
    [user, watched, favorites, movies, customMovies, setIsAuthModalOpen, notify]
  );

  const clearFavorites = useCallback(async () => {
    if (!user) return;
    setFavorites([]);
    const { error } = await supabase.from('favorites').delete().eq('user_id', user.id);
    if (error) notify({ type: 'error', message: 'Не удалось очистить избранное.' });
  }, [user, notify]);

  const deleteMovie = useCallback(
    async (movieId) => {
      if (!isAdmin) {
        notify({ type: 'error', message: 'Недостаточно прав для удаления фильма.' });
        return;
      }
      const { error } = await supabase.from('custom_movies').delete().eq('id', movieId);
      if (error) {
        notify({ type: 'error', message: 'Ошибка при удалении' });
        return;
      }
      setCustomMovies((prev) => prev.filter((m) => m.id !== movieId));
      setFavorites((prev) => prev.filter((f) => String(f?.id || f) !== String(movieId)));
      setWatched((prev) => prev.filter((w) => String(w?.id || w) !== String(movieId)));
      notify({ type: 'info', message: 'Удалено.' });
    },
    [notify, isAdmin]
  );

  const combinedMovies = useMemo(() => [...customMovies, ...movies], [customMovies, movies]);
  const sortedMovies = useFilter(combinedMovies, { searchQuery, selectedGenres, sortBy, sortOrder });
  const sortedFavorites = useFilter(favorites, { searchQuery, selectedGenres, sortBy, sortOrder });

  const isLoading = catalogRequestLoading;
  const moviesFetchError = localCatalogError || requestError;

  const dataValue = useMemo(
    () => ({
      movies: sortedMovies,
      favorites: sortedFavorites,
      watched,
      customMovies,
      isLoading,
      moviesFetchError,
      toggleFavorite,
      toggleWatched,
      clearFavorites,
      fetchMovies,
      fetchCustomMovies,
      getMovieVideo,
      deleteMovie,
    }),
    [
      sortedMovies,
      sortedFavorites,
      watched,
      customMovies,
      isLoading,
      moviesFetchError,
      toggleFavorite,
      toggleWatched,
      clearFavorites,
      fetchMovies,
      fetchCustomMovies,
      getMovieVideo,
      deleteMovie,
    ]
  );

  const filterValue = useMemo(
    () => ({
      page,
      setPage,
      totalPages,
      searchQuery,
      setSearchQuery,
      selectedGenres,
      setSelectedGenres,
      sortBy,
      setSortBy,
      sortOrder,
      setSortOrder,
    }),
    [page, totalPages, searchQuery, selectedGenres, sortBy, sortOrder]
  );

  const value = useMemo(() => ({ ...dataValue, ...filterValue }), [dataValue, filterValue]);

  return (
    <MovieDataContext.Provider value={dataValue}>
      <MovieFilterContext.Provider value={filterValue}>
        <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
      </MovieFilterContext.Provider>
    </MovieDataContext.Provider>
  );
};
