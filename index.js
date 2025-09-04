const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 1000;

// Configuración manual de CORS para evitar errores
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
    response_mime_type: 'application/json'  // Forzar respuesta JSON
  };

  try {
    // Realiza la petición al API de Gemini
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    // Lee la respuesta como texto para detectar posibles errores
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Respuesta no JSON válida de la API:', text);
      return res.status(500).json({ error: 'Respuesta inválida de la API de IA' });
    }

    // Si la respuesta HTTP no es OK, envía el error de la API
    if (!response.ok) {
      const errorMsg = data.error && data.error.message
        ? data.error.message
        : 'Error en la API de IA';
      return res.status(response.status).json({ error: errorMsg });
    }

    // Extrae el texto de la respuesta para enviar a frontend
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
    console.error('Error en la petición fetch:', e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor listo en puerto ${PORT}`);
});
