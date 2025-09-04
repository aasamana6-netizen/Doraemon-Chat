const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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
      return res.status(400).json({ error: data.error?.message || 'API error' });
    }
    const answer = data.candidates?.[0]?.content?.[0]?.text?.trim() || "No response.";
    res.json({ response: answer });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log('Servidor listo en puerto ' + PORT));
