import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeModal = ({ isOpen, onClose }) => {
  const { theme: currentTheme, setTheme, availableThemes } = useTheme();

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 9999, animation: 'fadeIn 0.2s'
      }}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
          borderRadius: '24px', padding: '30px', width: '90%', maxWidth: '600px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)', animation: 'fadeInUp 0.3s var(--ease-spring)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Оформление сайта</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
          {availableThemes.map((t) => {
            const isActive = currentTheme === t.id;
            return (
              <div 
                key={t.id}
                onClick={() => setTheme(t.id)}
                style={{
                  padding: '15px', borderRadius: '16px', cursor: 'pointer',
                  border: `2px solid ${isActive ? 'var(--primary)' : 'var(--glass-border)'}`,
                  background: 'var(--glass)', textAlign: 'center',
                  transition: 'all 0.2s', transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{t.icon}</div>
                <div style={{ fontWeight: isActive ? 'bold' : 'normal', marginBottom: '10px', fontSize: '0.9rem' }}>{t.name}</div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                  <span style={{ width: '15px', height: '15px', borderRadius: '50%', background: t.color1, border: '1px solid rgba(255,255,255,0.2)' }}></span>
                  <span style={{ width: '15px', height: '15px', borderRadius: '50%', background: t.color2 }}></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThemeModal;