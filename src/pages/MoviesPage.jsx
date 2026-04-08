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
             <div key={i} className="movie-card skeleton-card" style={{ height: '350px' }}>
               <div className="skeleton-poster" style={{ height: '70%', background: 'var(--glass-bg)' }}></div>
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
              /* ИСПОЛЬЗУЕМ ПАТТЕРН COMPOUND COMPONENTS */
              <MovieCard movie={movie} onClick={() => open(movie)}>
                <MovieCard.Header />
                <MovieCard.Body />
                <MovieCard.Footer>
                  
                  <button 
                    className={`action-btn ${isFavorite ? 'active-fav' : ''}`}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      toggleFavorite(movie.id); 
                    }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                    title="В избранное"
                  >
                    {isFavorite ? '❤️' : '🤍'}
                  </button>

                  <button 
                    className={`action-btn ${isWatched ? 'active-watch' : ''}`}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      toggleWatched(movie.id); 
                    }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                    title="Просмотрено"
                  >
                    {isWatched ? '👀' : '👁️‍🗨️'}
                  </button>

                </MovieCard.Footer>
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