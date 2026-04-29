const API_KEY = "AIzaSyD2xulkKgxZXmob1M-Flz-DxA3uD4Qcxj8";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// Теперь мы передаем не только новый вопрос, но и историю чата
export const askMovieAI = async (chatHistory, newPrompt) => {
  const systemContext = "Ты — эксперт по кино. Отвечай кратко, вежливо и на русском. Выделяй названия фильмов **жирным шрифтом**. Советуй по 2-3 фильма.";
  
  // Собираем последние 4 сообщения, чтобы бот помнил контекст, но не перегружался
  const recentHistory = chatHistory.slice(-4).map(msg => 
    `${msg.role === 'user' ? 'Пользователь' : 'ИИ'}: ${msg.text}`
  ).join('\n');

  // Формируем умный запрос с памятью
  const finalPrompt = `${systemContext}\n\nИстория переписки:\n${recentHistory}\n\nПользователь: ${newPrompt}\nИИ:`;

  const payload = {
    contents: [{ parts: [{ text: finalPrompt }] }]
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        if (response.status === 429) return "🤖: Слишком много запросов. Подождите 1 минуту!";
        if (response.status === 503) return "🤖: Серверы перегружены. Попробуйте через 10 секунд.";
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("AI Error:", error);
    return "Ой, что-то пошло не так. Проверьте интернет или подождите немного! 🍿";
  }
};