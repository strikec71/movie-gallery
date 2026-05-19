import { KP_GENRE_IDS } from '../constants/movieGenres';

export const KP_BASE_URL = 'https://kinopoiskapiunofficial.tech/api';

/**
 * @returns {string}
 */
export function getKinopoiskApiKey() {
  const key = import.meta.env.VITE_KINOPOISK_API_KEY;
  return typeof key === 'string' ? key.trim() : '';
}

/**
 * @param {object} params
 * @param {number} params.page
 * @param {string} params.searchQuery
 * @param {string[]} params.selectedGenres
 * @param {string} params.sortBy — rating | popularity | date
 */
export function buildKinopoiskCatalogUrl({ page, searchQuery, selectedGenres, sortBy }) {
  if (searchQuery) {
    return `${KP_BASE_URL}/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(searchQuery)}&page=${page}`;
  }

  let kpSort = 'RATING';
  if (sortBy === 'popularity') kpSort = 'NUM_VOTE';
  else if (sortBy === 'date') kpSort = 'YEAR';

  const genresQuery =
    selectedGenres.length > 0
      ? `&genres=${selectedGenres.map((g) => KP_GENRE_IDS[g]).join(',')}`
      : '';

  return `${KP_BASE_URL}/v2.2/films?order=${kpSort}&type=FILM&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=${page}${genresQuery}`;
}

/**
 * Нормализация одного элемента ответа API в модель приложения.
 * @param {object} item
 */
export function mapKinopoiskFilmToMovie(item) {
  const kpId = item.kinopoiskId || item.filmId;
  return {
    id: kpId,
    title: item.nameRu || item.nameOriginal || 'Без названия',
    originalTitle: item.nameOriginal || '',
    genres: item.genres
      ? item.genres.map((g) => g.genre.charAt(0).toUpperCase() + g.genre.slice(1)).slice(0, 3)
      : ['Кино'],
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
    poster:
      item.posterUrlPreview ||
      item.posterUrl ||
      'https://via.placeholder.com/500x750/181a20/8b9bb4?text=Нет+постера',
    description: item.description || item.shortDescription || 'Описание отсутствует.',
  };
}

/**
 * @param {object} data — тело JSON ответа списка / поиска
 * @returns {{ movies: object[], totalPages: number }}
 */
export function parseKinopoiskCatalogResponse(data) {
  const totalPages = Math.min(data.pagesCount || data.totalPages || 1, 20);
  const items = data.films || data.items || [];
  const movies = items.map(mapKinopoiskFilmToMovie);
  return { movies, totalPages };
}

/**
 * Запрос к API Кинопоиска (для эффектов вне useFetch, напр. трейлер в модалке).
 * @param {string} path — путь относительно KP_BASE_URL или полный URL
 */
export async function kinopoiskFetchJson(path, apiKey) {
  if (!apiKey) {
    throw new Error('Не задан ключ API Кинопоиска');
  }
  const url = path.startsWith('http') ? path : `${KP_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Кинопоиск API: ${response.status}`);
  }
  return response.json();
}

/**
 * @param {string|number} movieId
 * @param {string} apiKey
 * @returns {Promise<string|null>} YouTube video id или null
 */
export async function fetchYoutubeTrailerId(movieId, apiKey) {
  const data = await kinopoiskFetchJson(`/v2.2/films/${movieId}/videos`, apiKey);
  const trailer = data.items?.find(
    (vid) => vid.site === 'YOUTUBE' || vid.url?.includes('youtube')
  );
  if (trailer?.url) {
    const match = trailer.url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    return match ? match[1] : null;
  }
  return null;
}
