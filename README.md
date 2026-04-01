# 🎬 Movie Gallery — Твой личный мир кино

Modern Movie Collection App, созданный на **React 19** с акцентом на высокую производительность, адаптивный дизайн и удобство пользователя. 

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?logo=vercel)](ТВОЯ_ССЫЛКА_НА_VERCEL)
[![React Version](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/Vite-7.3-yellow?logo=vite)](https://vitejs.dev/)

## 🚀 Живое демо
Посмотреть проект в действии: [**movie-gallery-strikec71.vercel.app**](https://movie-gallery-rose.vercel.app)

---

## ✨ Основные возможности

* **🔍 Умный поиск и фильтрация:** Поиск по названию, фильтрация по жанрам и сортировка по рейтингу/популярности.
* **💖 Избранное:** Добавление фильмов в личную коллекцию (данные сохраняются в `localStorage`).
* **🎞️ Просмотр трейлеров:** Интеграция с YouTube API для просмотра официальных трейлеров прямо в модальном окне.
* **➕ Добавление своих фильмов:** Возможность расширять галерею собственными картинами через валидируемую форму.
* **📱 Ultra Responsive UI:** Интерфейс идеально адаптирован под любые устройства — от старых смартфонов до 4K мониторов.
* **🧩 Custom Hooks:** Логика вынесена в переиспользуемые хуки (`useForm`, `useModal`, `useFilter`).

---

## 🛠 Стек технологий

* **Frontend:** React 19, JSX.
* **State Management:** React Context API.
* **Styling:** Modern CSS (Flexbox, Grid, Glassmorphism, Media Queries).
* **Build Tool:** Vite.
* **Deployment:** Vercel (CI/CD настроен).
* **Routing:** React Router v7.

---

## 📂 Структура проекта

```text
src/
├── components/     # Переиспользуемые UI компоненты (Card, Navbar, Modal)
├── context/        # Глобальное состояние приложения (MovieContext)
├── hooks/          # Кастомные хуки для логики (useModal, useForm)
├── pages/          # Страницы приложения (Home, Movies, Profile, AddMovie)
├── tests/          # Модульные и интеграционные тесты
└── assets/         # Глобальные стили и статика
