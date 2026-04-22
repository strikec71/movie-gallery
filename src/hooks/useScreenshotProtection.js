import { useEffect } from 'react';

export const useScreenshotProtection = () => {
  useEffect(() => {
    // 1. Перехват и блокировка клавиши PrintScreen
    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen') {
        // Очищаем буфер обмена (записываем туда предупреждение)
        navigator.clipboard.writeText('Скриншоты запрещены политикой безопасности.');
        alert('Делать снимки этой страницы запрещено!');
      }
    };

    // 2. Блокировка вызова контекстного меню (правый клик мыши)
    const handleContextMenu = (e) => e.preventDefault();

    // 3. МГНОВЕННАЯ защита при потере фокуса (вызов "Ножниц", переключение окон)
    const applyProtection = () => {
      // --- ВАРИАНТ А: Сильный блюр (По умолчанию) ---
      document.body.style.filter = 'blur(25px)';
      
      // --- ВАРИАНТ Б: Черный/Пустой экран (Раскомментируй строки ниже, а строку выше удали) ---
      // document.body.style.opacity = '0';
      // document.body.style.backgroundColor = 'black';
      
      // КРИТИЧЕСКИ ВАЖНО: отключаем любую анимацию, чтобы сработало за 0 мс
      document.body.style.transition = 'none'; 
    };
    
    // Снятие защиты при возвращении на страницу
    const removeProtection = () => {
      document.body.style.filter = 'none';
      
      // Если используешь Вариант Б (черный экран), раскомментируй строки ниже:
      // document.body.style.opacity = '1';
      // document.body.style.backgroundColor = '';
    };

    const handleVisibilityChange = () => {
      if (document.hidden) applyProtection();
      else removeProtection();
    };

    // --- Назначаем слушатели событий ---
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Событие blur срабатывает быстрее всего при вызове "Ножниц"
    window.addEventListener('blur', applyProtection);
    window.addEventListener('focus', removeProtection);

    // 4. CSS-блокировка выделения текста на всей странице
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // --- Функция очистки (вызывается при уходе со страницы профиля) ---
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', applyProtection);
      window.removeEventListener('focus', removeProtection);
      
      // Возвращаем стили в нормальное состояние для других страниц
      removeProtection();
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
    };
  }, []); // Пустой массив зависимостей гарантирует, что хук сработает 1 раз при рендере
};