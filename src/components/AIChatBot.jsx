import React, { useState, useContext, useRef, useEffect } from 'react';
import { MovieContext } from '../context/MovieContext';
import { supabase } from '../api/supabase';
import MovieCard from './MovieCard';

// Берем тот же ключ и URL, что и в MovieContext
const KP_API_KEY = '0e8f6dd8-a45a-43b0-ab92-b89e84737bee';
const KP_BASE_URL = 'https://kinopoiskapiunofficial.tech/api';

const AIChatBot = () => {
  const { watched, favorites } = useContext(MovieContext);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: 'Привет! Напиши, что тебе нравится, и я найду для тебя идеальный фильм 🍿', 
      movies: [] 
    }
  ]);

  const messagesEndRef = useRef(null);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText, movies: [] }]);
    setIsLoading(true);

    try {
      // 1. Собираем историю (названия просмотренных и избранных фильмов), чтобы ИИ не повторялся
      const watchedTitles = (watched || []).map(m => m.title);
      const favTitles = (favorites || []).map(m => m.title);
      const historyTitles = [...new Set([...watchedTitles, ...favTitles])].filter(Boolean);

      // 2. Отправляем запрос в Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-recommend', {
        body: { prompt: userText, history: historyTitles }
      });

      if (error) throw error;

      // Получаем рекомендации от Gemini (ожидаем формат JSON)
      const recommendations = data?.recommendations || [];

      if (!recommendations || recommendations.length === 0) {
        setMessages(prev => [...prev, { role: 'ai', text: 'Не смог ничего подобрать. Попробуй описать иначе!', movies: [] }]);
        return;
      }

      // Формируем текстовый ответ с причинами
      let aiResponseText = 'Вот что я подобрал для тебя:\n\n';
      recommendations.forEach(r => {
         aiResponseText += `🍿 ${r.title} — ${r.reason}\n`;
      });

      // 3. Параллельно ищем фильмы на Кинопоиске по названиям от ИИ
      const fetchedMovies = [];
      
      await Promise.all(
        recommendations.map(async (rec) => {
          try {
            const res = await fetch(`${KP_BASE_URL}/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(rec.title)}&page=1`, {
              headers: {
                'X-API-KEY': KP_API_KEY,
                'Content-Type': 'application/json',
              }
            });
            
            const searchData = await res.json();
            const items = searchData.films || [];
            
            if (items.length > 0) {
              const item = items[0]; // Берем самый первый (наиболее релевантный) результат
              
              fetchedMovies.push({
                id: item.filmId,
                title: item.nameRu || item.nameOriginal || rec.title,
                originalTitle: item.nameOriginal || "",
                genres: item.genres ? item.genres.map(g => g.genre.charAt(0).toUpperCase() + g.genre.slice(1)).slice(0, 3) : ["Кино"],
                rating: parseFloat(item.rating || item.ratingKinopoisk || 0).toFixed(1),
                popularity: item.ratingVoteCount || item.votes || 0,
                year: item.year ? String(item.year) : '0000',
                poster: item.posterUrlPreview || item.posterUrl,
                description: item.description || rec.reason
              });
            }
          } catch (err) {
            console.error(`Ошибка при поиске фильма ${rec.title}:`, err);
          }
        })
      );

      // 4. Пушим ответ в чат вместе с карточками
      setMessages(prev => [...prev, { role: 'ai', text: aiResponseText, movies: fetchedMovies }]);

    } catch (error) {
      console.error("Ошибка ИИ:", error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Упс, нейросети перегрелись 🤯 Попробуй еще раз.', movies: [] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', border: 'none', fontSize: '28px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.5)', transition: 'transform 0.2s' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          ✨
        </button>
      ) : (
        <div style={{ width: '400px', height: '600px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', overflow: 'hidden', animation: 'fadeInUp 0.3s var(--ease-spring)' }}>
          
          {/* Header */}
          <div style={{ padding: '15px 20px', background: 'var(--glass)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✨</span> AI Кино-Ассистент
            </h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-muted)'}>✕</button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%' }}>
                
                <div style={{ padding: '12px 16px', borderRadius: '16px', borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px', borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '16px', background: msg.role === 'user' ? 'var(--primary)' : 'var(--glass)', color: msg.role === 'user' ? '#fff' : 'var(--text-main)', border: msg.role === 'ai' ? '1px solid var(--glass-border)' : 'none', whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.4' }}>
                  {msg.text}
                </div>

                {/* Рендер карточек */}
                {msg.movies?.length > 0 && (
                  <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', marginTop: '15px', paddingBottom: '10px' }} className="ai-movies-scroll">
                    {msg.movies.map(movie => (
                      <div key={movie.id} style={{ minWidth: '180px' }}>
                        <MovieCard movie={movie}>
                          <MovieCard.Poster />
                        </MovieCard>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', padding: '12px 16px', borderRadius: '16px', background: 'var(--glass)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Ищу шедевры... ⏳
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '15px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '10px', background: 'var(--bg-dark)' }}>
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Спроси меня о кино..." 
              style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontSize: '0.95rem' }}
            />
            <button type="submit" disabled={isLoading} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', width: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: isLoading ? 0.7 : 1 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatBot;