import React, { useState, useRef, useEffect } from 'react';
import { askMovieAI } from '../api/aiService';

// Наши быстрые запросы
const QUICK_BUTTONS = [
  "🎲 Случайный фильм",
  "👽 Про космос",
  "😂 Смешная комедия"
];

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Привет! Я твой кино-ассистент. Выбери быструю команду или напиши свой вопрос! 🍿' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  // Функция для отправки сообщения (работает и от кнопок, и от инпута)
  const handleSend = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = { role: 'user', text: textToSend };
    // Сохраняем текущую историю ДО того, как добавили новое сообщение
    const currentHistory = [...chatHistory]; 
    
    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    // Передаем историю и новый вопрос
    const aiResponse = await askMovieAI(currentHistory, textToSend);
    
    setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsTyping(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSend(message);
  };

  // Красивый рендер жирного текста (заменяет **текст** на <strong>текст</strong>)
  const formatText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} style={{ color: '#fff' }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      {/* Кнопка вызова */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          border: 'none', cursor: 'pointer', fontSize: '1.8rem',
          boxShadow: '0 10px 25px rgba(79, 172, 254, 0.4)',
          transition: 'transform 0.3s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Окно чата */}
      {isOpen && (
        <div style={{
          position: 'absolute', bottom: '80px', right: '0',
          width: '350px', height: '500px',
          background: 'rgba(20, 22, 28, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'fadeInUp 0.4s var(--ease-spring)'
        }}>
          {/* Header */}
          <div style={{ padding: '15px 20px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ margin: 0, color: '#4facfe', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>✨</span> Movie AI Helper
            </h4>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chatHistory.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)' : 'rgba(255,255,255,0.05)',
                padding: '12px 16px', borderRadius: '18px',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                borderBottomLeftRadius: msg.role === 'user' ? '18px' : '4px',
                maxWidth: '85%', fontSize: '0.95rem', lineHeight: '1.4',
                color: msg.role === 'user' ? '#fff' : '#e0e0e0',
                border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                {formatText(msg.text)}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '18px', fontSize: '0.9rem', color: '#888' }}>
                печатает... 💭
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Быстрые кнопки */}
          <div style={{ padding: '0 15px 10px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {QUICK_BUTTONS.map((btn, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(btn)}
                disabled={isTyping}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#4facfe', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem',
                  cursor: isTyping ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                  opacity: isTyping ? 0.5 : 1
                }}
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={onSubmit} style={{ padding: '15px', display: 'flex', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Спроси о фильмах..."
              disabled={isTyping}
              style={{
                flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '12px 15px', color: 'white', outline: 'none',
                fontSize: '0.95rem'
              }}
            />
            <button 
              type="submit" 
              disabled={isTyping || !message.trim()}
              style={{ 
                background: message.trim() && !isTyping ? '#4facfe' : 'rgba(255,255,255,0.1)', 
                border: 'none', borderRadius: '12px', padding: '0 20px', 
                cursor: message.trim() && !isTyping ? 'pointer' : 'not-allowed',
                color: '#fff', fontWeight: 'bold', transition: '0.3s'
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
