import React, { useContext, useCallback } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieListWrapper from '../components/MovieListWrapper';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import { useModal } from '../hooks/useModal';

const MoviesPage = () => {
  const { 
    movies, 
    isLoading, 
    page, 
    setPage, 
    totalPages, 
    favorites, 
    toggleFavorite,
    watched,
    toggleWatched
  } = useContext(MovieContext);
  
  const { isOpen, modalData, open, close } = useModal(); 

  const renderPagination = useCallback(() => {
    const pages = [];
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
      <FilterBar />

      {isLoading ? (
        <div className="movies-grid">
          {[...Array(8)].map((_, i) => (
             <div key={i} className="movie-card skeleton-card" style={{ height: '380px' }}>
               <div className="skeleton-poster" style={{ height: '75%', background: 'var(--glass-bg)' }}></div>
               <div className="skeleton-text" style={{ width: '70%', margin: '15px', background: 'var(--glass-bg)' }}></div>
               <div className="skeleton-text" style={{ width: '40%', margin: '0 15px', background: 'var(--glass-bg)' }}></div>
             </div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        
        /* ИСПОЛЬЗУЕМ ПАТТЕРН RENDER PROPS */
        <MovieListWrapper 
          movies={movies} 
          render={(movie) => {
            const isFavorite = favorites?.some(f => f.id === movie.id);
            const isWatched = watched?.includes(movie.id);

            return (
              /* СБОРКА КАРТОЧКИ: Используем правильные составные компоненты (Poster и Info) */
              <MovieCard key={movie.id} movie={movie} isWatched={isWatched} onClick={() => open(movie)}>
                <MovieCard.Poster>
                  
                  {/* Кнопки передаем внутрь постера, как children, чтобы они появились в оверлее */}
                  <button 
                    className={`favorite-action-btn ${isFavorite ? 'active' : ''}`}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      toggleFavorite(movie.id); 
                    }}
                    title={isFavorite ? "Удалить из избранного" : "В избранное"}
                  >
                    {isFavorite ? '❤️' : '🤍'}
                  </button>
                  
                  <button 
                    className={`watch-action-btn ${isWatched ? 'watched' : ''}`}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      toggleWatched(movie.id); 
                    }}
                  >
                    {isWatched ? 'Отменить' : '👀 Смотреть'}
                  </button>

                </MovieCard.Poster>
                
                <MovieCard.Info />
              </MovieCard>
            );
          }} 
        />

      ) : (
        <div className="no-results">
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🕵️‍♂️</div>
          <h3>Ничего не нашли...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Попробуйте изменить поисковый запрос или фильтры.</p>
        </div>
      )}

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
      
      {isOpen && (
        <Modal movie={modalData} onClose={close} />
      )}
    </div>
  );
};

export default MoviesPage;