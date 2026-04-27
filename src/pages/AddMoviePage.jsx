import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';
import { MovieContext } from '../context/MovieContext';
import { supabase } from '../api/supabase';

const AVAILABLE_GENRES = [
  "Action", "Comedy", "Drama", "Horror", "Sci-Fi", 
  "Thriller", "Romance", "Fantasy", "Animation", "Crime"
];

const AddMoviePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const { fetchCustomMovies } = useContext(MovieContext);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const posterUrlRef = useRef(null);
  const descriptionRef = useRef(null);

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
      default: break;
    }
    return errorMsg;
  }, []);

  const { values, setValues, errors, touched, setTouched, handleChange, handleBlur } = useForm({
    title: '', 
    rating: '', 
    genres: [], 
    isWatched: false
  }, validateField);

  useEffect(() => {
    const fetchMovieToEdit = async () => {
      if (isEditMode) {
        const { data: movieToEdit, error } = await supabase
          .from('custom_movies')
          .select('*')
          .eq('id', editId)
          .single();

        if (movieToEdit && !error) {
          setValues({
            title: movieToEdit.title,
            rating: movieToEdit.vote_average.toString(),
            genres: movieToEdit.genres || [],
            isWatched: false
          });

          if (posterUrlRef.current) {
            posterUrlRef.current.value = movieToEdit.poster_path || '';
          }
          if (descriptionRef.current) {
            descriptionRef.current.value = movieToEdit.description || '';
          }
        }
      }
    };
    
    fetchMovieToEdit();
  }, [editId, isEditMode, setValues]);

  const toggleGenre = useCallback((genre) => {
    const newGenres = values.genres.includes(genre)
      ? values.genres.filter(g => g !== genre)
      : [...values.genres, genre];
    
    setValues(prev => ({ ...prev, genres: newGenres }));
    setTouched(prev => ({ ...prev, genres: true }));
  }, [values.genres, setValues, setTouched]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    const titleError = validateField('title', values.title);
    const ratingError = validateField('rating', values.rating);
    const genresError = validateField('genres', values.genres);

    setTouched({ title: true, rating: true, genres: true });
    if (titleError || ratingError || genresError) return;

    setIsSubmitting(true);

    try {
      const posterValue = posterUrlRef.current?.value || '';
      const descriptionValue = descriptionRef.current?.value || '';

      const moviePayload = {
        title: values.title.trim(),
        vote_average: parseFloat(values.rating).toFixed(1),
        release_date: new Date().getFullYear().toString(),
        genres: values.genres,
        description: descriptionValue.trim(),
        poster_path: posterValue || `https://via.placeholder.com/500x750/181a20/ff0055?text=${encodeURIComponent(values.title)}`,
        user_id: user.id
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('custom_movies')
          .update(moviePayload)
          .eq('id', editId);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('custom_movies')
          .insert([moviePayload]);

        if (error) throw error;
      }

      await fetchCustomMovies();

      navigate('/movies');
    } catch (error) {
      console.error('Save failed:', error);
      setErrorMessage(error.message || 'Ошибка при сохранении фильма');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return <div className="page-container"><h2 style={{ textAlign: 'center' }}>Проверка доступа...</h2></div>;

  if (!user || !isAdmin) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', background: 'var(--bg-card)', padding: '50px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
          <h1 style={{ fontSize: '5rem', margin: '0 0 20px' }}>🔒</h1>
          <h2>Доступ закрыт</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>У вас нет прав Администратора для добавления фильмов.</p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '12px 30px', borderRadius: '12px' }}>На главную</button>
        </div>
      </div>
    );
  }

  // --- ОСНОВНОЙ РЕНДЕР ФОРМЫ ---
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
        
        <div style={{ flex: '1 1 500px', padding: 'clamp(20px, 5vw, 40px)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '30px', borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '10px' }}>
            {isEditMode ? 'Редактировать фильм' : 'Новый фильм'}
          </h2>

          {errorMessage && (
            <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff3b3b', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: '600' }}>Название фильма *</label>
              <input 
                type="text" name="title" value={values.title} onChange={handleChange} onBlur={handleBlur} 
                className="search-input"
                style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${errors.title && touched.title ? 'var(--primary)' : 'var(--glass-border)'}`, borderRadius: '12px', padding: '12px 16px' }} 
              />
              {errors.title && touched.title && <span style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.title}</span>}
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Рейтинг *</label>
                <input 
                  type="number" step="0.1" name="rating" value={values.rating} onChange={handleChange} onBlur={handleBlur} 
                  className="search-input"
                  style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${errors.rating && touched.rating ? 'var(--primary)' : 'var(--glass-border)'}`, borderRadius: '12px' }} 
                />
              </div>

              <div style={{ flex: '2 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>URL Постера</label>
                <input 
                  type="text" name="posterUrl" ref={posterUrlRef}
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
                      key={genre} type="button" onClick={() => toggleGenre(genre)}
                      style={{
                        padding: '8px 16px', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-main)',
                        border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--glass-border)'}`,
                        background: isSelected ? 'var(--primary)' : 'transparent',
                        color: isSelected ? 'var(--text-on-primary)' : 'var(--text-muted)',
                        fontWeight: isSelected ? 'bold' : 'normal',
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
                name="description" ref={descriptionRef}
                className="search-input"
                style={{ minHeight: '100px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', padding: '12px', width: '100%', resize: 'vertical' }} 
              />
            </div>

            <button type="submit" className="btn-primary glow-effect" disabled={isSubmitting} style={{ border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', width: '100%', padding: '15px', borderRadius: '12px', opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Сохранение...' : (isEditMode ? 'Сохранить изменения' : 'Опубликовать в БД')}
            </button>
          </form>
        </div>

        <div className="preview-aside" style={{ flex: '1 1 350px', background: 'rgba(0,0,0,0.2)', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--glass-border)' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Предпросмотр</h3>
          <div style={{ width: '280px', pointerEvents: 'none' }}>
            
            <MovieCard 
              movie={{
                title: values.title || 'Название фильма',
                rating: values.rating || '0.0',
                popularity: 'NEW',
                genres: values.genres.length > 0 ? values.genres : ['Жанр'],
                poster: `https://via.placeholder.com/500x750/181a20/8b9bb4?text=Постер`,
              }}
              isWatched={false}
            >
              <MovieCard.Poster />
              <MovieCard.Info />
            </MovieCard>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AddMoviePage;