const STORAGE_KEY = 'react-movie-custom';

const sleep = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms));

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const write = (movies) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
};

export const mockMoviesApi = {
  async getAll() {
    await sleep();
    return read();
  },

  async create(movie) {
    await sleep();
    const movies = read();
    const nextMovies = [movie, ...movies];
    write(nextMovies);
    return movie;
  },

  async update(movie) {
    await sleep();
    const movies = read();
    const exists = movies.some((m) => m.id === movie.id);
    if (!exists) throw new Error('Movie not found');
    const nextMovies = movies.map((m) => (m.id === movie.id ? movie : m));
    write(nextMovies);
    return movie;
  },

  async remove(movieId) {
    await sleep();
    const movies = read();
    const nextMovies = movies.filter((m) => m.id !== movieId);
    write(nextMovies);
    return { success: true };
  },
};
