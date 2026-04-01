import React, { useContext, useCallback } from 'react';
import { MovieContext } from '../context/MovieContext';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useForm } from '../hooks/useForm'; // ПОДКЛЮЧИЛИ КАСТОМНЫЙ ХУК

const AVAILABLE_GENRES = [
  "Action", "Comedy", "Drama", "Horror", "Sci-Fi", 
  "Thriller", "Romance", "Fantasy", "Animation", "Crime"
];

const AddMoviePage = () => {
  const { addMovie } = useContext(MovieContext);
  const navigate = useNavigate();

  // Наша функция валидации, которую мы передаем в хук
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
        if (value && !value.startsWith('http')) errorMsg = 'Ссылка должна начинаться с http:// или https://';
        break;
      default: break;
    }
    return errorMsg;
  }, []);

  // МАГИЯ ЛАБЫ 6: Вся логика состояний спрятана в useForm!
  const { values, setValues, errors, touched, setTouched, handleChange, handleBlur } = useForm({
    title: '', rating: '', description: '', posterUrl: '', genres: [], isWatched: false
  }, validateField);

  // Выбор жанров (модифицируем массив genres внутри объекта values)
  const toggleGenre = useCallback((genre) => {
    const newGenres = values.genres.includes(genre)
      ? values.genres.filter(g => g !== genre)
      : [...values.genres, genre];
    
    setValues(prev => ({ ...prev, genres: newGenres }));
    setTouched(prev => ({ ...prev, genres: true }));
  }, [values.genres, setValues, setTouched]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Принудительно проверяем ошибки перед отправкой
    const titleError = validateField('title', values.title);
    const ratingError = validateField('rating', values.rating);
    const genresError = validateField('genres', values.genres);
    const posterError = validateField('posterUrl', values.posterUrl);

    setTouched({ title: true, rating: true, genres: true, posterUrl: true });

    if (titleError || ratingError || genresError || posterError) return;

    // Собираем данные из объекта values, который отдал нам хук useForm
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

  const inputStyle = (fieldName) => ({
    width: '100%', padding: '12px 16px',
    background: 'rgba(0,0,0,0.4)',
    border: `1px solid ${errors[fieldName] && touched[fieldName] ? 'var(--primary)' : 'var(--glass-border)'}`,
    color: 'var(--text-main)', borderRadius: '12px', outline: 'none',
    fontSize: '1rem', transition: 'all 0.3s var(--ease-spring)',
    fontFamily: 'var(--font-main)'
  });

  return (
    <div className="page-container" style={{ animation: 'fadeInUp 0.8s var(--ease-spring)' }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        
        <div style={{ flex: '1 1 500px', padding: '40px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '30px', borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '10px' }}>
            Новый фильм
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: '600' }}>Название фильма *</label>
              <input type="text" name="title" value={values.title} onChange={handleChange} onBlur={handleBlur} style={inputStyle('title')} />
              {errors.title && touched.title && <span style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.title}</span>}
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 150px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Рейтинг (1-10) *</label>
                <input type="number" step="0.1" name="rating" value={values.rating} onChange={handleChange} onBlur={handleBlur} style={inputStyle('rating')} />
                {errors.rating && touched.rating && <span style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.rating}</span>}
              </div>
              <div style={{ flex: '2 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>URL Постера</label>
                <input type="text" name="posterUrl" value={values.posterUrl} onChange={handleChange} onBlur={handleBlur} style={inputStyle('posterUrl')} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Жанры (минимум 1) *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {AVAILABLE_GENRES.map(genre => {
                  const isSelected = values.genres.includes(genre);
                  return (
                    <button
                      key={genre} type="button" onClick={() => toggleGenre(genre)}
                      style={{
                        padding: '6px 14px', borderRadius: '50px',
                        border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--glass-border)'}`,
                        background: isSelected ? 'var(--primary)' : 'transparent',
                        color: isSelected ? 'white' : 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.2s', fontWeight: isSelected ? 'bold' : 'normal',
                        fontFamily: 'var(--font-main)'
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '}{genre}
                    </button>
                  );
                })}
              </div>
              {errors.genres && touched.genres && <span style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.genres}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Сюжет</label>
              <textarea name="description" value={values.description} onChange={handleChange} style={{ ...inputStyle('description'), minHeight: '120px', resize: 'vertical' }} />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginTop: '10px', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <input type="checkbox" name="isWatched" checked={values.isWatched} onChange={handleChange} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
              <span style={{ fontSize: '1rem' }}>Я уже посмотрел этот фильм</span>
            </label>

            <button type="submit" className="btn-primary glow-effect" style={{ marginTop: '20px', width: '100%', border: 'none', cursor: 'pointer' }}>
              Сохранить в коллекцию
            </button>
          </form>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: Предпросмотр */}
        <div style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.3)', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--glass-border)' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '30px', textAlign: 'center' }}>Предпросмотр карточки</h3>
          
          <div style={{ width: '260px', pointerEvents: 'none' }}>
            <MovieCard 
              movie={{
                id: 'preview',
                title: values.title || 'Название фильма',
                rating: values.rating || '0.0',
                popularity: 'NEW',
                genres: values.genres.length > 0 ? values.genres : ['Жанр'],
                poster: values.posterUrl || `https://via.placeholder.com/500x750/181a20/8b9bb4?text=${encodeURIComponent(values.title || 'Постер')}`,
              }}
              isFavorite={false}
              isWatched={values.isWatched}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddMoviePage;