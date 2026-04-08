import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

// Массив всех наших тем для модального окна
export const availableThemes = [
  { id: 'dark', name: 'Тёмный космос', icon: '🌌', color1: '#0f1014', color2: '#ff0055' },
  { id: 'light', name: 'Светлый', icon: '☀️', color1: '#f0f2f5', color2: '#ff0055' },
  { id: 'cinema', name: 'Кинотеатр', icon: '🍿', color1: '#140005', color2: '#ffb703' },
  { id: 'cyberpunk', name: 'Киберпанк', icon: '🤖', color1: '#090014', color2: '#fce205' },
  { id: 'matrix', name: 'Матрица', icon: '💻', color1: '#000000', color2: '#00ff41' },
  { id: 'ocean', name: 'Океан', icon: '🌊', color1: '#001219', color2: '#00b4d8' },
  { id: 'sunset', name: 'Закат', icon: '🌇', color1: '#2b1029', color2: '#fca311' },
  { id: 'dracula', name: 'Дракула', icon: '🧛‍♂️', color1: '#282a36', color2: '#ff79c6' },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Возвращаем функцию прямой установки темы
  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);