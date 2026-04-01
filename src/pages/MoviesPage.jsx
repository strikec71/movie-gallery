import React, { useContext, useCallback } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieList from '../components/MovieList';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import { useModal } from '../hooks/useModal';

/**
 * СТРАНИЦА ГАЛЕРЕИ ФИЛЬМОВ
 * Основной хаб приложения: фильтрация, пагинация и просмотр деталей.
 */
const MoviesPage = () => {
  const { 
    movies, 
    isLoading, 
    page, 
    setPage, 
    totalPages, 
    favorites, 
    toggleFavorite 
  } = useContext(MovieContext);
  
  // Используем кастомный хук для управления состоянием модального окна
  const { isOpen, modalData, open, close } = useModal(); 

  /**
   * РЕНДЕР ПАГИНАЦИИ
   * Генерирует кнопки страниц. Логика оптимизирована для больших списков.
   */
  const renderPagination = useCallback(() => {
    const pages = [];
    // Показываем максимум 5 кнопок вокруг текущей страницы, чтобы не загромождать мобилку
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${i === page ? 'active' : ''}`}
          onClick={() => {
            setPage(i);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {i}
        </button>
      );
    }
    return pages;
  }, [page, totalPages, setPage]);

  return (
    <div className="page-container" style={{ animation: 'fadeInUp 0.8s var(--ease-spring)' }}>
      {/* ПАНЕЛЬ ФИЛЬТРОВ (Sticky на десктопе) */}
      <FilterBar />

      {/* ОСНОВНОЙ КОНТЕНТ */}
      {isLoading ? (
        /* СОСТОЯНИЕ ЗАГРУЗКИ (СКЕЛЕТОНЫ) */
        <div className="movie-list">
          {[...Array(8)].map((_, i) => (
             <div key={i} className="movie-card skeleton-card">
               <div className="skeleton-poster"></div>
               <div className="skeleton-text" style={{ width: '70%' }}></div>
               <div className="skeleton-text" style={{ width: '40%' }}></div>
             </div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        /* СПИСОК ФИЛЬМОВ */
        <MovieList 
          movies={movies} 
          favorites={favorites.map(f => f.id)} 
          onToggleFavorite={toggleFavorite} 
          onMovieClick={open} 
        />
      ) : (
        /* ЕСЛИ НИЧЕГО НЕ НАЙДЕНО */
        <div className="no-results">
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🕵️‍♂️</div>
          <h3>Ничего не нашли...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Попробуйте изменить поисковый запрос или фильтры.</p>
        </div>
      )}

      {/* ПАГИНАЦИЯ (Показываем только если есть данные и нет загрузки) */}
      {!isLoading && movies.length > 0 && totalPages > 1 && (
        <div className="pagination-container">
          <button 
            className="page-btn" 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            &larr;
          </button>
          
          {renderPagination()}
          
          <button 
            className="page-btn" 
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            &rarr;
          </button>
        </div>
      )}
      
      {/* МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ */}
      {isOpen && (
        <Modal movie={modalData} onClose={close} />
      )}
    </div>
  );
};

export default MoviesPage;