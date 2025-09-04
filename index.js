const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 1000;

// Configuración manual de CORS
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://doraemon-chat-84c5f.web.app',
    'https://doraemon-chat-84c5f.firebaseapp.com',
    'http://localhost:3000'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro:generateContent?key=${API_KEY}`;
  const body = {
    prompt: { text: prompt },
    temperature: 0.7,
    maxOutputTokens: 256,
    response_mime_type: 'application/json'  // Solicita JSON puro
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    // Leer la respuesta como texto y luego parsear
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Respuesta no JSON de la API:', text);
      return res.status(500).json({ error: 'Invalid response from AI API' });
    }

    if (!response.ok) {
      const errorMsg = data.error && data.error.message
        ? data.error.message
        : 'API error';
      return res.status(response.status).json({ error: errorMsg });
    }

    // Extraer el texto de la respuesta
    let answer = 'No response.';
    if (
      data.candidates &&
      Array.isArray(data.candidates) &&
      data.candidates[0].content &&
      Array.isArray(data.candidates[0].content) &&
      data.candidates[0].content[0].text
    ) {
      answer = data.candidates[0].content[0].text.trim();
    }

    res.json({ response: answer });
  } catch (e) {
    console.error('Fetch error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor listo en puerto ${PORT}`);
});
