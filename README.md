# React Movie Gallery

SPA для поиска и коллекционирования фильмов на **React 19** и **Vite 7**: каталог (Kinopoisk Unofficial API), избранное и «Просмотрено» в **Supabase**, кастомные фильмы для админов, темы оформления, AI-ассистент (Groq), тесты (**Vitest** + **Testing Library**).

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?logo=vercel)](https://movie-gallery-rose.vercel.app)

## Живое демо

[movie-gallery-rose.vercel.app](https://movie-gallery-rose.vercel.app)

## Возможности

- Каталог, поиск, фильтры по жанрам, сортировка, пагинация, модалка с трейлером (YouTube)
- Избранное и просмотренные с синхронизацией в Supabase (после входа)
- Авторизация (email/password и Google OAuth через Supabase)
- Темы UI с сохранением в `localStorage`
- Добавление и редактирование пользовательских фильмов (роль `admin` в метаданных пользователя)
- AI-чат по кино на странице каталога
- Ленивая загрузка страниц и модалки (`React.lazy` + `Suspense`)

## Переменные окружения

Скопируйте [.env.example](.env.example) в **`.env.local`** и заполните значения (один файл для всех ключей; не используйте отдельный `.env`).

| Переменная | Назначение |
|------------|------------|
| `VITE_SUPABASE_URL` | URL проекта Supabase |
| `VITE_SUPABASE_ANON_KEY` | Публичный anon key |
| `VITE_KINOPOISK_API_KEY` | Ключ [Kinopoisk API Unofficial](https://kinopoiskapiunofficial.tech/) |
| `VITE_GROQ_API_KEY` | Ключ [Groq](https://console.groq.com/) для чат-ассистента |

**Не коммитьте** файлы с реальными ключами. В репозитории должен быть только `.env.example`.

### Деплой на Vercel

Файл `.env.local` **не попадает** на Vercel. Переменные нужно добавить вручную:

1. [Vercel Dashboard](https://vercel.com) → ваш проект → **Settings** → **Environment Variables**
2. Добавьте все `VITE_*` из `.env.example` (включая `VITE_GROQ_API_KEY`)
3. Отметьте окружения **Production**, **Preview**, **Development**
4. **Deployments** → последний деплой → **Redeploy** (пересборка обязательна — Vite вшивает `VITE_*` на этапе build)

Если ключ раньше был в GitHub, перевыпустите его в [Groq Console](https://console.groq.com/) и укажите новый в Vercel и в локальном `.env.local`.

## Архитектура

- `src/components` — UI
- `src/pages` — маршруты
- `src/context` — глобальное состояние (фильмы, тема, уведомления, авторизация)
- `src/hooks` — `useForm`, `useFetch`, `useModal`, `useFilter`, и др.
- `src/api` — клиенты Supabase, Kinopoisk, AI
- `src/constants` — общие константы (жанры)

## Запуск

```bash
git clone https://github.com/strikec71/movie-gallery.git
cd movie-gallery
npm install
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173).

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Режим разработки |
| `npm run build` | Сборка |
| `npm run preview` | Превью production-сборки |
| `npm run test` | Vitest |
| `npm run lint` | ESLint |

## Тестирование

```bash
npm run test
```

Покрытие: кастомные хуки, компоненты списка, интеграция страницы фильмов, HOC `withAuth`.

## Стек

React 19, React Router 7, Vite 7, Supabase JS, Vitest, Testing Library, ESLint.
