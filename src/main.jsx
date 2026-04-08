import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { MovieProvider } from './context/MovieContext.jsx' 
import { ThemeProvider } from './context/ThemeContext'; // <-- импорт

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <MovieProvider>
        <App />
      </MovieProvider>
    </ThemeProvider>
  </React.StrictMode>,
)