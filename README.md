🎬 React Movie Gallery — Advanced SPA
Современное Single Page Application (SPA) для поиска и коллекционирования фильмов, созданное на React 19 и Vite. Проект демонстрирует применение продвинутых паттернов проектирования, работу с глобальным состоянием, тестирование и глубокое внимание к UX.

🚀 Живое демо
Посмотреть проект в действии: movie-gallery-rose.vercel.app

✨ Ключевые возможности (Features)
🎨 Умные темы оформления (Theme Switcher): 8 уникальных цветовых палитр (Светлая, Тёмная, Кинотеатр, Киберпанк, Матрица и др.) с плавными переходами и сохранением выбора в localStorage.

🌍 Мультиязычность (i18n): Перевод интерфейса "на лету" (RU/EN) с использованием Context API.

🎰 Кино-рулетка (Movie Roulette): Анимированный интерактивный компонент для случайного выбора фильма с возможностью быстрого добавления в Избранное.

📱 PWA (Progressive Web App): Приложение можно установить на экран смартфона или компьютера как нативное.

👁️‍🗨️ Списки пользователя: Поддержка списков «Избранное» и «Просмотрено» с мгновенным обновлением UI и синхронизацией.

🔍 Глубокая фильтрация: Поиск, сортировка (по рейтингу, дате, популярности) и фильтрация по жанрам.

🔒 Защита маршрутов: Реализована имитация авторизации через паттерн HOC (withAuth).

🏗 Архитектура и паттерны проектирования
В проекте сделан упор на масштабируемость и чистоту кода. Применены следующие подходы:

Compound Components (Составные компоненты): Компонент MovieCard разбит на подкомпоненты (<MovieCard.Poster>, <MovieCard.Info>), что решает проблему Props Drilling и повышает переиспользуемость.

Higher-Order Components (HOC): Компонент withAuth используется для защиты приватных роутов (например, добавление фильма).

Render Props & Wrapper Components: Использование MovieListWrapper для инкапсуляции логики отрисовки списков, пустых состояний и ошибок.

Custom Hooks (Пользовательские хуки):

useFetch — универсальный хук для работы с API (статусы загрузки, ошибки).

useForm — переиспользуемая логика валидации форм.

useModal — управление состояниями модальных окон.

useFilter — изоляция логики сортировки и поиска.

Context API: Глобальное состояние разделено на логические блоки (MovieContext, ThemeContext, LanguageContext), чтобы избежать лишних ререндеров.

Code Splitting (Ленивая загрузка): Страницы подгружаются через React.lazy() и <Suspense>, что значительно ускоряет начальную загрузку (First Contentful Paint).

🧪 Тестирование
Проект покрыт автотестами (Unit и Integration) для обеспечения надежности бизнес-логики и компонентов:

Тестирование кастомных хуков (useFetch.test.js, useForm.test.js).

Интеграционное тестирование сложных страниц (MoviesIntegration.test.jsx).

Тестирование изоляции HOC и Context.

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
git clone https://github.com/ВАШ_НИК/ИМЯ_РЕПОЗИТОРИЯ.git
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
