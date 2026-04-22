import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../api/supabase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Глобальный стейт модалки

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = user?.user_metadata?.role === 'admin';
  
  // --- ВОТ ЭТИ ФУНКЦИИ Я СЛУЧАЙНО УДАЛИЛ В ПРОШЛЫЙ РАЗ ---
  const signUp = (email, password) => supabase.auth.signUp({ email, password });
  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ 
      user, loading, isAdmin, 
      signIn, signUp, signOut, // <-- Обязательно передаем их сюда!
      isAuthModalOpen, setIsAuthModalOpen 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);