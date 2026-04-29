import React, { useState, useRef, useEffect } from 'react';
import { askMovieAI } from '../api/aiService';

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Привет! Я твой кино-ассистент. Что хочешь посмотреть сегодня?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Автопрокрутка чата вниз
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { role: 'user', text: message };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    const aiResponse = await askMovieAI(message);
    
    setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsTyping(false);
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
          width: '320px', height: '450px',
          background: 'rgba(20, 22, 28, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'fadeInUp 0.4s var(--ease-spring)'
        }}>
          {/* Header */}
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ margin: 0, color: '#4facfe' }}>Movie AI Helper</h4>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {chatHistory.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? '#4facfe' : 'rgba(255,255,255,0.05)',
                padding: '10px 15px', borderRadius: '15px',
                maxWidth: '80% content-box', fontSize: '0.9rem',
                border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)'
              }}>
                {msg.text}
              </div>
            ))}
            {isTyping && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Печатает...</div>}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} style={{ padding: '15px', display: 'flex', gap: '8px' }}>
            <input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Спроси меня..."
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', padding: '10px', color: 'white', outline: 'none'
              }}
            />
            <button type="submit" style={{ background: '#4facfe', border: 'none', borderRadius: '10px', padding: '0 15px', cursor: 'pointer' }}>
              →
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;