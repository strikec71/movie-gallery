# 🎬 React Movie Gallery

Современное Single Page Application (SPA) для поиска и коллекционирования фильмов. Проект создан на **React 19** и **Vite**, демонстрирует применение продвинутых паттернов проектирования, работу с глобальным состоянием, тестирование и глубокое внимание к UX.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?logo=vercel)](https://movie-gallery-rose.vercel.app)
[![React Version](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/Vite-7.3-yellow?logo=vite)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple?logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

## 🚀 Живое демо
[**movie-gallery-rose.vercel.app**](https://movie-gallery-rose.vercel.app)

---

## ✨ Ключевые возможности

* **🎨 Темы оформления (Theme Switcher):** 8 уникальных цветовых палитр (Светлая, Тёмная, Кинотеатр, Киберпанк, Матрица и др.) с плавными переходами и сохранением в `localStorage`.
* **🌍 Мультиязычность (i18n):** Мгновенный перевод интерфейса (RU/EN) через Context API.
* **🎰 Кино-рулетка:** Анимированный интерактивный компонент для случайного выбора фильма с быстрым добавлением в списки.
* **📱 PWA (Progressive Web App):** Возможность установки приложения на смартфон или ПК.
* **👁️‍🗨️ Коллекции:** Поддержка списков «Избранное» и «Просмотрено» с синхронизацией состояния.
* **🔍 Продвинутая фильтрация:** Поиск, сортировка (по рейтингу, дате, популярности) и фильтрация по жанрам.
* **🔒 Защита маршрутов:** Имитация авторизации через паттерн **HOC** (`withAuth`).

---

## 🏗 Архитектура и паттерны

* **Compound Components:** Компонент `MovieCard` разбит на подкомпоненты (`<MovieCard.Poster>`, `<MovieCard.Info>`) для гибкости и решения проблемы Props Drilling.
* **Higher-Order Components (HOC):** Изоляция логики доступа к маршрутам.
* **Render Props & Wrappers:** Использование `MovieListWrapper` для инкапсуляции состояний загрузки, ошибок и пустых списков.
* **Custom Hooks:** * `useFetch` — универсальная работа с API.
  * `useForm` — валидация форм.
  * `useModal` — управление состояниями окон.
  * `useFilter` — изоляция сортировки и поиска.
* **Context API:** Разделение глобального состояния на логические блоки (`MovieContext`, `ThemeContext`, `LanguageContext`).
* **Code Splitting:** Ленивая загрузка страниц через `React.lazy()` и `<Suspense>` для ускорения начальной загрузки (First Contentful Paint).

---

## 🧪 Тестирование

Проект покрыт Unit и Integration тестами:
* Тестирование кастомных хуков (`useFetch`, `useForm`).
* Интеграционное тестирование страниц (`MoviesIntegration`).
* Изолированное тестирование HOC и Context.

---

## 🛠 Стек технологий

* **Фреймворк:** React 19, React Router v7
* **Сборщик:** Vite
* **Стилизация:** Modern CSS (CSS Variables, Flexbox/Grid, Animations, Backdrop Filter)
* **Архитектура:** Context API, Custom Hooks, Portals
* **Оптимизация:** Code Splitting, PWA manifest
* **Деплой:** Vercel (CI/CD, Speed Insights)

---

## 💻 Локальный запуск

1. Клонируйте репозиторий:
```bash
git clone [https://github.com/strikec71/movie-gallery.git](https://github.com/strikec71/movie-gallery.git)
🛠 Стек технологий
Core: React 19, JSX, React Router DOM v7

State & Logic: Context API, Custom Hooks, Portals

Build & Tooling: Vite

Styling: Modern CSS (CSS Variables, Flexbox/Grid, Animations, Backdrop Filter)

Performance: Code Splitting, PWA manifest, Vercel Speed Insights

Deployment: Vercel (CI/CD)

📂 Структура проекта
Plaintext
src/
├── components/     # Переиспользуемые UI компоненты (Modal, Card, Navbar)
├── context/        # Провайдеры глобального состояния (Movie, Theme, Language)
├── hoc/            # Компоненты высшего порядка (withAuth)
├── hooks/          # Кастомные хуки для инкапсуляции логики
├── pages/          # Страницы (Home, Movies, Profile, AddMovie, Favorites)
├── tests/          # Модульные и интеграционные тесты (.test.jsx)
├── index.css       # Глобальные стили, переменные тем, анимации
└── main.jsx        # Точка входа в приложение
💻 Установка и запуск (Local Development)
Клонируйте репозиторий:

Bash
git clone https://github.com/strikec71/movie-gallery.git
Перейдите в папку проекта:

Bash
cd movie-gallery
Установите зависимости:

Bash
npm install
Запустите проект в режиме разработки:

Bash
npm run dev
Приложение будет доступно по адресу http://localhost:5173.
