import React, { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieList from '../components/MovieList';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import { useModal } from '../hooks/useModal';

/**
 * СТРАНИЦА ИЗБРАННОГО
 * Отображает коллекцию пользователя с поддержкой фильтрации и модальных окон.
 */
const FavoritesPage = () => {
  const { favorites, clearFavorites, toggleFavorite } = useContext(MovieContext);
  
  // Управление детальным просмотром через наш кастомный хук
  const { isOpen, modalData, open, close } = useModal();

  return (
    <div className="page-container" style={{ animation: 'fadeInUp 0.8s var(--ease-spring)' }}>
      
      {/* ШАПКА СТРАНИЦЫ */}
      <div className="section-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h2 style={{ margin: 0 }}>
          Моя коллекция <span className="badge" style={{ verticalAlign: 'middle', marginLeft: '10px' }}>{favorites.length}</span>
        </h2>
        
        {favorites.length > 0 && (
          <button 
            onClick={clearFavorites} 
            className="modal-btn danger" 
            style={{ 
              width: 'auto', 
              padding: '10px 20px', 
              fontSize: '0.9rem' 
            }}
          >
            🗑️ Очистить всё
          </button>
        )}
      </div>

      {/* ПАНЕЛЬ ФИЛЬТРОВ (поиск внутри избранного) */}
      <FilterBar />
      
      {/* КОНТЕНТНАЯ ОБЛАСТЬ */}
      {favorites.length > 0 ? (
        <MovieList 
          movies={favorites} 
          favorites={favorites.map(f => f.id)} 
          onToggleFavorite={toggleFavorite} 
          onMovieClick={open} 
        />
      ) : (
        /* КРАСИВОЕ ПУСТОЕ СОСТОЯНИЕ */
        <div className="no-results" style={{ padding: '100px 20px' }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px', filter: 'grayscale(1)' }}>💔</div>
          <h3>Ваш список пуст</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '10px auto' }}>
            Добавляйте фильмы в избранное, чтобы они всегда были под рукой. 
            Ваша коллекция хранится локально.
          </p>
          <button 
            className="btn-primary" 
            style={{ marginTop: '30px', border: 'none', cursor: 'pointer' }}
            onClick={() => window.location.href = '/movies'}
          >
            🍿 Найти что-нибудь
          </button>
        </div>
      )}
      
      {/* МОДАЛЬНОЕ ОКНО ДЛЯ ДЕТАЛЕЙ */}
      {isOpen && (
        <Modal movie={modalData} onClose={close} />
      )}
    </div>
  );
};

export default FavoritesPage;