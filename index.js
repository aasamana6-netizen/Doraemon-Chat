const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();

// Configura CORS para tu web Firebase y local
app.use(cors({
  origin: [
    'https://doraemon-chat-84c5f.web.app',
    'https://doraemon-chat-84c5f.firebaseapp.com',
    'http://localhost:5000'
  ],
  methods: ['GET', 'POST'],
}));
app.use(bodyParser.json());

// ⚡ CONFIGURA TU TOKEN DE HUGGING FACE AQUÍ
const openai = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.TOKEN    // La variable TOKEN en Render debe ser tu token hf_...
});

// Puedes cambiar el modelo/editando esta variable:
const modeloIA = "mistralai/Mistral-7B-Instruct-v0.2"; // Cambia aquí el modelo si lo necesitas

app.get('/', (req, res) => {
  res.send('Doraemon IA backend activo 🚀');
});

app.post('/chat', async (req, res) => {
  try {
    const mensajeUsuario = req.body.mensaje;
    if (!mensajeUsuario) {
      return res.status(400).json({ error: 'Falta el mensaje en la petición.' });
    }
    // Llamada a Hugging Face Inference API con el modelo indicado
    const completion = await openai.chat.completions.create({
      model: modeloIA,
      messages: [{ role: "user", content: mensajeUsuario }]
    });

    const respuestaIA = completion.choices[0].message.content;
    res.json({ respuesta: respuestaIA });

  } catch (error) {
    console.error('Error en /chat:', error.message);
    res.status(500).json({ error: error.message || "Lo siento, no puedo responder ahora." });
  }
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Servidor Doraemon backend escuchando en puerto ${PORT}`);
});
