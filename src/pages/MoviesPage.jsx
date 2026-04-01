import React, { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieList from '../components/MovieList';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import { useModal } from '../hooks/useModal'; // 1. Импортируем хук

const MoviesPage = () => {
  const { movies, isLoading, page, setPage, totalPages, favorites, toggleFavorite } = useContext(MovieContext);
  
  // 2. ИСПОЛЬЗУЕМ КАСТОМНЫЙ ХУК ВМЕСТО useState
  const { isOpen, modalData, open, close } = useModal(); 

  const renderPagination = () => { /* ...твой старый код пагинации... */ };

  return (
    <div className="page-container">
      <FilterBar />
      {isLoading ? (
        <div className="movie-list">
          {[...Array(8)].map((_, i) => (
             <div key={i} className="movie-card skeleton-card"><div className="skeleton-poster"></div></div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        <MovieList 
          movies={movies} 
          favorites={favorites.map(f => f.id)} 
          onToggleFavorite={toggleFavorite} 
          onMovieClick={open} // 3. Передаем функцию open из хука
        />
      ) : (
        <div className="no-results">Ничего не найдено 😔</div>
      )}
      {!isLoading && movies.length > 0 && <div className="pagination-container">{renderPagination()}</div>}
      
      {/* 4. Рендерим модалку на основе стейтов хука */}
      {isOpen && (
        <Modal movie={modalData} onClose={close} />
      )}
    </div>
  );
};

export default MoviesPage;