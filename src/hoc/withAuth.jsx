import React, { useState } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [isAuthenticated] = useState(() => localStorage.getItem('movie-gallery-auth') !== 'false');

    if (!isAuthenticated) {
      return (
        <div className="page-container" style={{ textAlign: 'center', padding: '100px 20px', animation: 'fadeIn 0.5s' }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ color: 'var(--primary)' }}>Доступ ограничен</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Только авторизованные пользователи могут добавлять или редактировать фильмы.
          </p>
          <button 
            className="btn-primary" 
            style={{ marginTop: '20px', border: 'none' }}
            onClick={() => window.history.back()}
          >
            Вернуться назад
          </button>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;