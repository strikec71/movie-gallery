const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY; 
const API_URL = "https://api.groq.com/openai/v1/chat/completions"; 

export const askMovieAI = async (chatHistory, newPrompt) => {
  const systemContext = "Ты — продвинутый эксперт по кино. Отвечай кратко, вежливо и строго на русском языке. Выделяй названия фильмов **жирным шрифтом**. Советуй по 2-3 фильма.";
  
  const messages = [
    { role: "system", content: systemContext }
  ];

  // Игнорируем самое первое приветственное сообщение от бота
  const realHistory = chatHistory.filter((msg, index) => index !== 0);

  // Берем последние 4 сообщения для памяти
  realHistory.slice(-4).forEach(msg => {
    messages.push({
      role: msg.role === 'user' ? "user" : "assistant",
      content: msg.text
    });
  });

  messages.push({ role: "user", content: newPrompt });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", 
        messages: messages,
        temperature: 0.7 
      })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("ОШИБКА ОТ GROQ:", JSON.stringify(errorData, null, 2));
        
        if (response.status === 400) return "🤖: Проблема с форматом. Попробуй перезагрузить страницу и спросить снова!";
        if (response.status === 401) return "🤖: Ошибка ключа. Проверьте файл .env!";
        
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("AI Error:", error);
    return "Ой, связь с ИИ прервалась. Проверьте интернет или консоль! 🍿";
  }
};