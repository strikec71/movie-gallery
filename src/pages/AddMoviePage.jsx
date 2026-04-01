import React, { useContext, useCallback } from 'react';
import { MovieContext } from '../context/MovieContext';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useForm } from '../hooks/useForm';

const AVAILABLE_GENRES = [
  "Action", "Comedy", "Drama", "Horror", "Sci-Fi", 
  "Thriller", "Romance", "Fantasy", "Animation", "Crime"
];

const AddMoviePage = () => {
  const { addMovie } = useContext(MovieContext);
  const navigate = useNavigate();

  // Функция валидации (полная версия без сокращений)
  const validateField = useCallback((name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'title':
        if (!value.trim()) errorMsg = 'Название обязательно';
        else if (value.length < 3) errorMsg = 'Минимум 3 символа';
        break;
      case 'rating':
        const num = parseFloat(value);
        if (!value) errorMsg = 'Укажите рейтинг';
        else if (isNaN(num) || num < 1 || num > 10) errorMsg = 'От 1.0 до 10.0';
        break;
      case 'genres':
        if (value.length === 0) errorMsg = 'Выберите хотя бы один жанр';
        break;
      case 'posterUrl':
        if (value && !value.startsWith('http')) errorMsg = 'Ссылка должна начинаться с http';
        break;
      default: break;
    }
    return errorMsg;
  }, []);

  // Наш кастомный хук useForm
  const { values, setValues, errors, touched, setTouched, handleChange, handleBlur } = useForm({
    title: '', 
    rating: '', 
    description: '', 
    posterUrl: '', 
    genres: [], 
    isWatched: false
  }, validateField);

  const toggleGenre = useCallback((genre) => {
    const newGenres = values.genres.includes(genre)
      ? values.genres.filter(g => g !== genre)
      : [...values.genres, genre];
    
    setValues(prev => ({ ...prev, genres: newGenres }));
    setTouched(prev => ({ ...prev, genres: true }));
  }, [values.genres, setValues, setTouched]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация перед отправкой
    const titleError = validateField('title', values.title);
    const ratingError = validateField('rating', values.rating);
    const genresError = validateField('genres', values.genres);

    setTouched({ title: true, rating: true, genres: true });

    if (titleError || ratingError || genresError) return;

    const newMovie = {
      id: Date.now(),
      title: values.title.trim(),
      rating: parseFloat(values.rating).toFixed(1),
      popularity: Math.floor(Math.random() * 500) + 100,
      year: new Date().getFullYear().toString(),
      genres: values.genres,
      description: values.description.trim(),
      poster: values.posterUrl || `https://via.placeholder.com/500x750/181a20/ff0055?text=${encodeURIComponent(values.title)}`,
    };

    addMovie(newMovie, values.isWatched);
    navigate('/movies');
  };

  return (
    <div className="page-container" style={{ animation: 'fadeInUp 0.8s var(--ease-spring)' }}>
      <div className="form-wrapper" style={{ 
        display: 'flex', 
        background: 'var(--bg-card)', 
        borderRadius: '24px', 
        border: '1px solid var(--glass-border)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        overflow: 'hidden'
      }}>
        
        {/* ЛЕВАЯ ЧАСТЬ: ФОРМА */}
        <div style={{ flex: '1 1 500px', padding: 'clamp(20px, 5vw, 40px)' }}>
          <h2 style={{ 
            marginTop: 0, 
            marginBottom: '30px', 
            borderBottom: '2px solid var(--primary)', 
            display: 'inline-block', 
            paddingBottom: '10px' 
          }}>
            Новый фильм
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: '600' }}>
                Название фильма *
              </label>
              <input 
                type="text" 
                name="title" 
                value={values.title} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                className="search-input"
                style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  border: `1px solid ${errors.title && touched.title ? 'var(--primary)' : 'var(--glass-border)'}`,
                  borderRadius: '12px',
                  padding: '12px 16px'
                }} 
              />
              {errors.title && touched.title && (
                <span style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
                  {errors.title}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Рейтинг *</label>
                <input 
                  type="number" 
                  step="0.1" 
                  name="rating" 
                  value={values.rating} 
                  onChange={handleChange} 
                  onBlur={handleBlur} 
                  className="search-input"
                  style={{ 
                    background: 'rgba(0,0,0,0.3)', 
                    border: `1px solid ${errors.rating && touched.rating ? 'var(--primary)' : 'var(--glass-border)'}`,
                    borderRadius: '12px'
                  }} 
                />
              </div>
              <div style={{ flex: '2 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>URL Постера</label>
                <input 
                  type="text" 
                  name="posterUrl" 
                  value={values.posterUrl} 
                  onChange={handleChange} 
                  className="search-input"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '12px' }} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-muted)' }}>Жанры *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {AVAILABLE_GENRES.map(genre => {
                  const isSelected = values.genres.includes(genre);
                  return (
                    <button
                      key={genre} 
                      type="button" 
                      onClick={() => toggleGenre(genre)}
                      style={{
                        padding: '8px 16px', 
                        borderRadius: '50px',
                        border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--glass-border)'}`,
                        background: isSelected ? 'var(--primary)' : 'transparent',
                        color: isSelected ? 'white' : 'var(--text-muted)',
                        cursor: 'pointer', 
                        transition: 'all 0.2s', 
                        fontWeight: isSelected ? 'bold' : 'normal',
                        fontFamily: 'var(--font-main)'
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '}{genre}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Описание</label>
              <textarea 
                name="description" 
                value={values.description} 
                onChange={handleChange} 
                className="search-input"
                style={{ 
                  minHeight: '100px', 
                  borderRadius: '12px', 
                  background: 'rgba(0,0,0,0.3)', 
                  border: '1px solid var(--glass-border)',
                  padding: '12px'
                }} 
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary glow-effect" 
              style={{ border: 'none', cursor: 'pointer', width: '100%' }}
            >
              Добавить фильм
            </button>
          </form>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: ПРЕДПРОСМОТР (Скрывается на мобилках через CSS) */}
        <div className="preview-aside" style={{ 
          flex: '1 1 350px', 
          background: 'rgba(0,0,0,0.2)', 
          padding: '40px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          borderLeft: '1px solid var(--glass-border)' 
        }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Предпросмотр</h3>
          <div style={{ width: '280px', pointerEvents: 'none' }}>
            <MovieCard 
              movie={{
                title: values.title || 'Название фильма',
                rating: values.rating || '0.0',
                popularity: 'NEW',
                genres: values.genres.length > 0 ? values.genres : ['Жанр'],
                poster: values.posterUrl || `https://via.placeholder.com/500x750/181a20/8b9bb4?text=Постер`,
              }}
              isFavorite={false}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddMoviePage;