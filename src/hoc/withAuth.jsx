import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { user, loading, setIsAuthModalOpen } = useAuth();

    useEffect(() => {
      if (!loading && !user) {
        setIsAuthModalOpen(true);
      }
    }, [user, loading, setIsAuthModalOpen]);

    if (loading) {
      return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <h2>Проверка безопасности...</h2>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;