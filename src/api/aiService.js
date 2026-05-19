const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/** @returns {string} */
export function getGroqApiKey() {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  return typeof key === 'string' ? key.trim() : '';
}

function missingKeyMessage() {
  if (import.meta.env.PROD) {
    return '🤖: AI недоступен: задайте VITE_GROQ_API_KEY в Vercel → Project → Settings → Environment Variables (Production), затем Redeploy.';
  }
  return '🤖: Задайте VITE_GROQ_API_KEY в .env.local и перезапустите npm run dev.';
}

export const askMovieAI = async (chatHistory, newPrompt) => {
  const apiKey = getGroqApiKey();

  // #region agent log
  fetch('http://127.0.0.1:7708/ingest/4ab6f7cb-8a10-4bc2-902a-e271e653d261',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'33b281'},body:JSON.stringify({sessionId:'33b281',location:'aiService.js:askMovieAI-entry',message:'groq key check',data:{hasKey:!!apiKey,keyLength:apiKey.length,isProd:!!import.meta.env.PROD,mode:import.meta.env.MODE},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  if (!apiKey) {
    return missingKeyMessage();
  }

  const systemContext =
    'Ты — продвинутый эксперт по кино. Отвечай кратко, вежливо и строго на русском языке. Выделяй названия фильмов **жирным шрифтом**. Советуй по 2-3 фильма.';

  const messages = [{ role: 'system', content: systemContext }];

  const realHistory = chatHistory.filter((msg, index) => index !== 0);

  realHistory.slice(-4).forEach((msg) => {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text,
    });
  });

  messages.push({ role: 'user', content: newPrompt });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.7,
      }),
    });

    // #region agent log
    fetch('http://127.0.0.1:7708/ingest/4ab6f7cb-8a10-4bc2-902a-e271e653d261',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'33b281'},body:JSON.stringify({sessionId:'33b281',location:'aiService.js:groq-response',message:'groq http status',data:{status:response.status,ok:response.ok},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ОШИБКА ОТ GROQ:', JSON.stringify(errorData, null, 2));

      if (response.status === 400) {
        return '🤖: Проблема с форматом. Попробуй перезагрузить страницу и спросить снова!';
      }
      if (response.status === 401) {
        return import.meta.env.PROD
          ? '🤖: Неверный или отозванный ключ Groq. Обновите VITE_GROQ_API_KEY в Vercel и сделайте Redeploy.'
          : '🤖: Неверный VITE_GROQ_API_KEY в .env.local (проверьте ключ на console.groq.com).';
      }
      if (response.status === 429) {
        return '🤖: Слишком много запросов. Подождите минуту и попробуйте снова.';
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // #region agent log
    fetch('http://127.0.0.1:7708/ingest/4ab6f7cb-8a10-4bc2-902a-e271e653d261',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'33b281'},body:JSON.stringify({sessionId:'33b281',location:'aiService.js:groq-success',message:'groq reply received',data:{hasContent:!!content,contentLength:content?.length??0},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    return content ?? '🤖: Пустой ответ от модели.';
  } catch (error) {
    console.error('AI Error:', error);
    return 'Ой, связь с ИИ прервалась. Проверьте интернет или консоль! 🍿';
  }
};
