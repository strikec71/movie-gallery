import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './App.css';

// 1. Импортируем компонент аналитики (обязательно из /react)
import { SpeedInsights } from "@vercel/speed-insights/react"

const HomePage = lazy(() => import('./pages/HomePage'));
const MoviesPage = lazy(() => import('./pages/MoviesPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AddMoviePage = lazy(() => import('./pages/AddMoviePage'));

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        
        <main>
          <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px', fontSize: '20px' }}>Загрузка страницы... ⏳</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/add-movie" element={<AddMoviePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />

        <SpeedInsights />
      </div>
    </Router>
  );
}

export default App;