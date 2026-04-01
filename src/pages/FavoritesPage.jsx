import React, { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieList from '../components/MovieList';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import { useModal } from '../hooks/useModal'; // <-- Подключаем хук

const FavoritesPage = () => {
  const { favorites, clearFavorites, toggleFavorite } = useContext(MovieContext);
  
  // ЗАДАЧА 4: Управление модалкой через кастомный хук
  const { isOpen, modalData, open, close } = useModal();

  return (
    <div className="page-container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2>Мое Избранное ({favorites.length})</h2>
        {favorites.length > 0 && (
          <button onClick={clearFavorites} className="clear-btn" style={{ background: '#ff3b3b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
            Очистить всё
          </button>
        )}
      </div>
      <FilterBar />
      
      {favorites.length > 0 ? (
        <MovieList 
          movies={favorites} // Фильтрация уже работает внутри Context через useFilter!
          favorites={favorites.map(f => f.id)} 
          onToggleFavorite={toggleFavorite} 
          onMovieClick={open} // Передаем функцию открытия из хука
        />
      ) : (
        <div className="no-results" style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
          В избранном пусто (или не найдено по фильтрам) 💔
        </div>
      )}
      
      {/* Рендерим модалку на основе стейтов хука */}
      {isOpen && <Modal movie={modalData} onClose={close} />}
    </div>
  );
};

export default FavoritesPage;