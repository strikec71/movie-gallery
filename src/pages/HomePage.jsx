import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ГЛАВНАЯ СТРАНИЦА (LANDING)
 * Использует сложные градиенты, анимации fadeInUp и 
 * адаптивные секции из index.css
 */
const HomePage = () => {
  return (
    <main className="landing-page">
      
      {/* ПЕРВЫЙ ЭКРАН (HERO) */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-tag">🎬 Твой личный кинотеатр</span>
          <h1 className="hero-title">
            Мир кино <br />
            <span className="gradient-text">у тебя в кармане</span>
          </h1>
          <p className="hero-subtitle">
            Миллионы фильмов, удобный поиск и ваша личная коллекция избранного. 
            Никакой рекламы, только чистое искусство.
          </p>
          
          <div className="hero-buttons">
            <Link to="/movies" className="btn-primary glow-effect">
              🍿 Смотреть галерею
            </Link>
            <Link to="/profile" className="btn-secondary">
              👤 Мой профиль
            </Link>
          </div>
        </div>
      </section>

      {/* СЕКЦИЯ ПРЕИМУЩЕСТВ (FEATURES) */}
      <section className="features-section">
        <h2 className="section-title">Почему выбирают нас?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Умный поиск</h3>
            <p>Находите фильмы по названию, жанрам или рейтингу за доли секунды.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h3>Избранное</h3>
            <p>Сохраняйте любимые картины, чтобы не потерять их и посмотреть позже.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Скорость</h3>
            <p>Мгновенная загрузка данных и плавные анимации для вашего комфорта.</p>
          </div>
        </div>
      </section>

      {/* СЕКЦИЯ ЖАНРОВ (GENRES PREVIEW) */}
      <section className="genres-preview-section">
        <div className="genres-banner">
          <div className="genres-text">
            <h2>На любой вкус</h2>
            <p>От леденящих кровь хорроров до добрых семейных комедий.</p>
            <Link to="/movies" className="text-link">Перейти к жанрам &rarr;</Link>
          </div>
          
          <div className="genres-visuals">
            <div className="genre-pill action">Боевики</div>
            <div className="genre-pill drama">Драмы</div>
            <div className="genre-pill comedy">Комедии</div>
            <div className="genre-pill sci-fi">Фантастика</div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default HomePage;