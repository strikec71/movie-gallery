import React, { useState, useContext } from 'react';
import { MovieContext } from '../context/MovieContext';

const withAuth = (WrappedComponent) => {
  return (props) => {
    // Получаем статусы и функции из нашего контекста
    const { authStatus, loginStep1, loginStep2_2FA } = useContext(MovieContext);
    
    // Локальные состояния для полей ввода
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    const handleLoginSubmit = (e) => {
      e.preventDefault();
      loginStep1(email, password);
    };

    const handle2FASubmit = (e) => {
      e.preventDefault();
      loginStep2_2FA(code);
    };

    // --- СЦЕНАРИЙ 1: Пользователь не авторизован (Нужен Логин и Пароль) ---
    if (authStatus === 'logged_out') {
      return (
        <div className="page-container" style={{ textAlign: 'center', padding: '50px 20px', animation: 'fadeIn 0.5s' }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Вход для администраторов</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
            Данные для входа: admin@mail.com / 12345
          </p>
          
          <form onSubmit={handleLoginSubmit} style={{ maxWidth: '300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="search-input"
              required
            />
            <input 
              type="password" 
              placeholder="Пароль" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="search-input"
              required
            />
            <button type="submit" className="btn-primary" style={{ border: 'none' }}>
              Войти
            </button>
          </form>
        </div>
      );
    }

    // --- СЦЕНАРИЙ 2: Пароль подошел, ждем код 2FA ---
    if (authStatus === 'pending_2fa') {
      return (
        <div className="page-container" style={{ textAlign: 'center', padding: '50px 20px', animation: 'fadeIn 0.5s' }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>📱</div>
          <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Двухфакторная аутентификация</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
            Мы отправили код на ваш email.<br/>(Подсказка: введите 0000)
          </p>
          
          <form onSubmit={handle2FASubmit} style={{ maxWidth: '300px', margin: '0 auto' }}>
            <input 
              type="text" 
              maxLength="4"
              placeholder="0000" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="search-input"
              style={{ fontSize: '2rem', textAlign: 'center', letterSpacing: '10px' }}
              required
            />
            <button type="submit" className="btn-primary" style={{ marginTop: '20px', width: '100%', border: 'none' }}>
              Подтвердить
            </button>
          </form>
        </div>
      );
    }

    // --- СЦЕНАРИЙ 3: Полностью авторизован ---
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;