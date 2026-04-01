import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-container" style={{textAlign: 'center', padding: '100px 0'}}>
      <h1 style={{fontSize: '5rem', margin: 0, color: 'var(--primary)'}}>404</h1>
      <h2>Страница не найдена</h2>
      <p style={{color: 'var(--text-muted)', marginBottom: '30px'}}>Кажется, вы заблудились в киновселенной.</p>
      <Link to="/" style={{
        background: 'var(--primary)', color: 'white', padding: '12px 24px', 
        borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold'
      }}>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFoundPage;