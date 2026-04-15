import React, { useContext, useState } from 'react';
import { MovieContext } from '../context/MovieContext';
import RouletteModal from './RouletteModal';

const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", 
  "Documentary", "Drama", "Family", "Fantasy", "History", 
  "Horror", "Music", "Mystery", "Romance", "Sci-Fi", 
  "TV Movie", "Thriller", "War", "Western"
];

const FilterBar = () => {
  const { 
    searchQuery, setSearchQuery, 
    selectedGenres, setSelectedGenres,
    sortBy, setSortBy,
    sortOrder, setSortOrder
  } = useContext(MovieContext);

  // Local UI state for roulette modal visibility.
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);

  // Toggle genre chips in a multi-select list.
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Flip sorting direction while keeping the same sort key.
  const toggleSortOrder = () => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        <div className="control-group">
          <div className="input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              placeholder="Найти фильм..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="divider"></div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="genre-select">
            <option value="rating">⭐ По рейтингу</option>
            <option value="popularity">🔥 По хайпу</option>
            <option value="date">📅 По дате</option>
            <option value="title">abc По имени</option>
          </select>
          <div className="divider"></div>
          <button className="sort-order-btn" onClick={toggleSortOrder}>
            {sortOrder === 'desc' 
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg> 
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
            }
          </button>
        </div>
      </div>

      <div className="genre-tags">
        {GENRES.map(genre => (
          <button key={genre} className={`genre-tag ${selectedGenres.includes(genre) ? 'active' : ''}`} onClick={() => toggleGenre(genre)}>
            {genre}
          </button>
        ))}
        {selectedGenres.length > 0 && (
          <button className="genre-tag clear-genres" onClick={() => setSelectedGenres([])}>✕ Сбросить</button>
        )}
        
        <button 
          className="genre-tag" 
          onClick={() => setIsRouletteOpen(true)}
          style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            fontWeight: 'bold',
            borderColor: 'var(--primary)',
            boxShadow: '0 4px 10px rgba(255, 0, 85, 0.3)'
          }}
        >
          🎲 Случайный фильм
        </button>
      </div>

      <RouletteModal isOpen={isRouletteOpen} onClose={() => setIsRouletteOpen(false)} />
    </div>
  );
};

export default FilterBar;