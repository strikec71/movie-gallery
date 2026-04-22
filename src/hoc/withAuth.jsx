import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { user, loading, setIsAuthModalOpen } = useAuth();

    useEffect(() => {
      // Если проверка закончилась, а пользователя нет — открываем модалку входа
      if (!loading && !user) {
        setIsAuthModalOpen(true);
      }
    }, [user, loading, setIsAuthModalOpen]);

    // 1. Пока Supabase проверяет токен — показываем загрузку
    if (loading) {
      return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <h2>Проверка безопасности...</h2>
        </div>
      );
    }

    // 2. Если Гость — редиректим на главную (модалка откроется сама благодаря useEffect)
    if (!user) {
      return <Navigate to="/" replace />;
    }

    // 3. Если авторизован — пускаем на страницу
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;