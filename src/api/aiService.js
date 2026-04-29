const API_KEY = "AIzaSyD2xulkKgxZXmob1M-Flz-DxA3uD4Qcxj8";

// Используем 2.0-flash как самую стабильную
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export const askMovieAI = async (userPrompt) => {
  const systemContext = "Ты — эксперт по кино. Отвечай кратко, вежливо и на русском. Посоветуй 3 фильма.";
  
  const payload = {
    contents: [{ parts: [{ text: `${systemContext}\n\nПользователь: ${userPrompt}` }] }]
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        // ОБРАБОТКА ЛИМИТОВ (429)
        if (response.status === 429) {
            return "🤖: Я очень популярен! Слишком много запросов. Подождите 1 минуту и я снова буду готов советовать фильмы.";
        }
        
        // ОБРАБОТКА ПЕРЕГРУЗКИ (503)
        if (response.status === 503) {
            return "🤖: Серверы Google сейчас перегружены. Попробуйте нажать кнопку еще раз через 10 секунд.";
        }

        const errorData = await response.json().catch(() => ({}));
        console.error("ОШИБКА ОТ GOOGLE:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("AI Error:", error);
    return "Ой, что-то пошло не так. Проверьте интернет или подождите немного! 🍿";
  }
};