import React, { useContext, useCallback, Suspense, lazy } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieListWrapper from '../components/MovieListWrapper';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import { useModal } from '../hooks/useModal';

// Lazy-load modal to keep initial page bundle smaller.
const Modal = lazy(() => import('../components/Modal'));

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

  const scrollToTopSafe = useCallback(() => {
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent || '')) return;
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // jsdom does not implement scrollTo in tests.
    }
  }, []);

  // Render a sliding 5-page window around the current page.
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
            scrollToTopSafe();
          }}
        >
          {i}
        </button>
      );
    }
    return pages;
  }, [page, totalPages, setPage, scrollToTopSafe]);

  return (
    <div className="page-container" style={{ animation: 'fadeInUp 0.8s var(--ease-spring)' }}>
      <FilterBar />

      {isLoading ? (
        // Skeletons preserve layout while async data is loading.
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
        
        <MovieListWrapper 
          movies={movies} 
          render={(movie) => {
            const isFavorite = favorites?.some(f => f.id === movie.id);
            const isWatched = watched?.includes(movie.id);

            return (
              <MovieCard key={movie.id} movie={movie} isWatched={isWatched} onClick={() => open(movie)}>
                <MovieCard.Poster>
                  
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
        // Suspense fallback is shown only while modal chunk is loading.
        <Suspense fallback={
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '20px', borderRadius: '10px' }}>
            Загрузка данных фильма... ⏳
          </div>
        }>
          <Modal movie={modalData} onClose={close} />
        </Suspense>
      )}
    </div>
  );
};

export default MoviesPage;