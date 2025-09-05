const express = require('express');
const fetch = require('node-fetch');
const app = express();

const PORT = process.env.PORT || 1000;

// Configuración manual de CORS para evitar errores desde frontend
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

const API_KEY = process.env.TOKEN; // Variable entorno TOKEN con Hugging Face Key

app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  const apiUrl = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    // Leer la respuesta como texto para manejar errores abiertos
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Respuesta no JSON válida de la API:', text);
      return res.status(500).json({ error: 'Respuesta inválida de la API de IA' });
    }

    // Si la respuesta HTTP no es OK, manda el error de la API
    if (!response.ok) {
      const errorMsg = data.error && data.error.message
        ? data.error.message
        : 'Error en la API de IA';
      return res.status(response.status).json({ error: errorMsg });
    }

    // El texto generado viene en data[0].generated_text
    let answer = (data[0] && data[0].generated_text) ? data[0].generated_text.trim() : 'No se recibió respuesta válida.';
    res.json({ response: answer });

  } catch (e) {
    console.error('Error en la petición fetch:', e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor listo en puerto ${PORT}`);
});
