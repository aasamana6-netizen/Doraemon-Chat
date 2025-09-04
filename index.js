const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 1000;

// CORS manual - funciona mejor en Render
app.use(function(req, res, next) {
  const allowedOrigins = [
    'https://doraemon-chat-84c5f.web.app',
    'https://doraemon-chat-84c5f.firebaseapp.com',
    'http://localhost:3000'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;
  const url = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro:generateContent?key=${API_KEY}`;
  const body = {
    prompt: { text: prompt },
    temperature: 0.7,
    maxOutputTokens: 256
  };

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await resp.json();

    if (!resp.ok) {
      let errorMessage = 'API error';
      if (data.error && data.error.message) {
        errorMessage = data.error.message;
      }
      return res.status(400).json({ error: errorMessage });
    }

    let answer = "No response.";
    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.length > 0 &&
      data.candidates[0].content[0].text
    ) {
      answer = data.candidates[0].content[0].text.trim();
    }

    res.json({ response: answer });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log('Servidor listo en puerto ' + PORT));
