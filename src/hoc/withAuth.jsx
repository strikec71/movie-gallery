import React, { useState } from 'react';

/**
 * HOC (Higher Order Component) для защиты страниц.
 * Оборачивает любой компонент и проверяет права доступа.
 */
const withAuth = (WrappedComponent) => {
  return (props) => {
    // В реальном проекте мы бы брали это из Context или LocalStorage.
    // Для сдачи лабы просто используем локальный стейт (поменяй на false, чтобы увидеть эффект ограничения).
    const [isAuthenticated] = useState(true); 

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

    // Если авторизован — рендерим саму страницу и прокидываем все пропсы
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;