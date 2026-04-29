import React, { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieList from '../components/MovieList';
import Modal from '../components/Modal';
import { useModal } from '../hooks/useModal';

const WatchedPage = () => {
  const { watched, favorites, toggleFavorite } = useContext(MovieContext);
  
  const { isOpen, modalData, open, close } = useModal();

  return (
    <div className="page-container" style={{ animation: 'fadeInUp 0.8s var(--ease-spring)' }}>
      <div className="page-header">
        <h1 className="gradient-text">История просмотров 🍿</h1>
        <p className="page-subtitle">Фильмы, которые вы уже оценили</p>
      </div>

      {watched && watched.length > 0 ? (
        <MovieList 
          movies={watched} 
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onMovieClick={(movie) => open(movie)} 
        />
      ) : (
        <div className="empty-state" style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
          <div className="empty-icon" style={{ fontSize: '4rem', marginBottom: '20px' }}>👀</div>
          <h2>Список пуст</h2>
          <p style={{ color: 'var(--text-muted)' }}>Отмечайте просмотренные фильмы, нажав на кнопку "Смотреть" на карточке.</p>
        </div>
      )}

      {isOpen && (
        <Modal movie={modalData} onClose={close} />
      )}
    </div>
  );
};

export default WatchedPage;