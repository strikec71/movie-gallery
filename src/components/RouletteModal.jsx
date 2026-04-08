import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom'; // <-- 1. ДОБАВЛЯЕМ ИМПОРТ ПОРТАЛА
import { MovieContext } from '../context/MovieContext';

const RouletteModal = ({ isOpen, onClose }) => {
  const { movies, toggleFavorite, favorites, toggleWatched, watched } = useContext(MovieContext);
  const [spinning, setSpinning] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);

  // Сбрасываем состояние при закрытии
  useEffect(() => {
    if (!isOpen) {
      setSpinning(false);
      setCurrentMovie(null);
    }
  }, [isOpen]);

  const startRoulette = () => {
    if (!movies || movies.length === 0) return;
    setSpinning(true);
    
    let time = 50; 
    let iterations = 0;
    const maxIterations = 25; 

    // Рекурсивная функция для эффекта "замедления" колеса рулетки
    const spin = () => {
      const randomIdx = Math.floor(Math.random() * movies.length);
      setCurrentMovie(movies[randomIdx]);
      iterations++;

      if (iterations < maxIterations) {
        time += 10; 
        setTimeout(spin, time);
      } else {
        setSpinning(false); 
      }
    };

    setTimeout(spin, time);
  };

  if (!isOpen) return null;

  const isFav = currentMovie ? favorites?.some(f => f.id === currentMovie.id) : false;
  const isWatch = currentMovie ? watched?.includes(currentMovie.id) : false;

  // 2. ОБОРАЧИВАЕМ ВОЗВРАТ В createPortal И ТЕЛЕПОРТИРУЕМ В document.body
  return createPortal(
    <div className="modal-overlay" onClick={onClose} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000,
        animation: 'fadeIn 0.2s'
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
          background: 'var(--bg-card)', padding: '0', borderRadius: '24px',
          border: '1px solid var(--glass-border)', overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)', width: '90%', maxWidth: '450px',
          animation: 'fadeInUp 0.3s var(--ease-spring)'
      }}>
        
        {/* ШАПКА МОДАЛКИ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', borderBottom: '1px solid var(--glass-border)' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>🎲 Кино-рулетка</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', transition: '0.2s' }}>
            ✕
          </button>
        </div>
        
        {/* ТЕЛО (ЭКРАН РУЛЕТКИ) */}
        <div style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '30px', position: 'relative' }}>
          
          {!currentMovie ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🍿</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>
                Не знаете, что посмотреть?<br/>Доверьтесь случаю!
              </p>
            </div>
          ) : (
            <div style={{ 
              transform: spinning ? 'scale(0.95)' : 'scale(1)', 
              opacity: spinning ? 0.6 : 1,
              transition: 'all 0.2s ease-out',
              textAlign: 'center', width: '100%'
            }}>
              <img 
                src={currentMovie.poster} 
                alt={currentMovie.title} 
                style={{ 
                  width: '180px', height: '270px', objectFit: 'cover', 
                  borderRadius: '16px', marginBottom: '15px',
                  boxShadow: spinning ? 'none' : '0 10px 20px rgba(0,0,0,0.4)',
                  border: spinning ? '2px solid transparent' : '2px solid var(--primary)'
                }} 
              />
              <h3 style={{ margin: '0 0 10px', fontSize: '1.3rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentMovie.title}
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', color: 'var(--text-muted)' }}>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px' }}>
                  ⭐ {currentMovie.rating}
                </span>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px' }}>
                  📅 {currentMovie.year}
                </span>
              </div>

              {/* ПАНЕЛЬ ДЕЙСТВИЙ */}
              {!spinning && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', animation: 'fadeIn 0.5s' }}>
                  <button 
                    onClick={() => toggleFavorite(currentMovie.id)}
                    style={{ background: isFav ? 'var(--primary)' : 'var(--glass)', color: isFav ? 'var(--text-on-primary)' : 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '10px 20px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {isFav ? '❤️ В избранном' : '🤍 В избранное'}
                  </button>
                  <button 
                    onClick={() => toggleWatched(currentMovie.id)}
                    style={{ background: isWatch ? 'var(--text-main)' : 'var(--glass)', color: isWatch ? 'var(--bg-dark)' : 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '10px 20px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: isWatch ? 'bold' : 'normal' }}
                  >
                    {isWatch ? '👀 Просмотрено' : '👁️‍🗨️ Отметить'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ПОДВАЛ С КНОПКАМИ УПРАВЛЕНИЯ */}
        <div style={{ padding: '20px 25px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '10px' }}>
          {currentMovie && !spinning ? (
            <>
              <button onClick={startRoulette} className="btn-secondary" style={{ flex: 1, padding: '12px', borderRadius: '12px' }}>
                🔄 Перекрутить
              </button>
              <button onClick={onClose} className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '12px' }}>
                ✅ Беру!
              </button>
            </>
          ) : (
            <button 
              onClick={startRoulette} 
              disabled={spinning}
              className="btn-primary" 
              style={{ width: '100%', padding: '15px', fontSize: '1.2rem', borderRadius: '12px', opacity: spinning ? 0.7 : 1 }}
            >
              {spinning ? 'Крутим колесо...' : 'Поехали! 🚀'}
            </button>
          )}
        </div>

      </div>
    </div>,
    document.body // <-- Телепортируем верстку модалки прямо в <body>
  );
};

export default RouletteModal;