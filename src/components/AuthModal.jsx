import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createPortal } from 'react-dom';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true); // Переключатель: Вход или Регистрация
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (authError) throw authError;
      
      // Если это регистрация, Supabase по умолчанию требует подтверждения почты,
      // но в тестовом режиме он сразу логинит, если отключить Email Confirmations в настройках.
      if (!isLogin) {
          alert('Регистрация успешна! Теперь вы можете войти.');
          setIsLogin(true);
      } else {
          onClose(); // Закрываем модалку при успешном входе
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Неверный email или пароль' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', padding: '40px', borderRadius: '24px',
        width: '90%', maxWidth: '400px', border: '1px solid var(--glass-border)'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: 'var(--text-main)' }}>{isLogin ? 'Вход' : 'Регистрация'}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>

        {error && <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff3b3b', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" placeholder="Email" required
            value={email} onChange={e => setEmail(e.target.value)}
            style={{ padding: '12px 15px', borderRadius: '12px', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}
          />
          <input 
            type="password" placeholder="Пароль (минимум 6 символов)" required minLength="6"
            value={password} onChange={e => setPassword(e.target.value)}
            style={{ padding: '12px 15px', borderRadius: '12px', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}
          />
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px', borderRadius: '12px', marginTop: '10px' }}>
            {loading ? 'Подождите...' : (isLogin ? 'Войти' : 'Создать аккаунт')}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </span>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default AuthModal;