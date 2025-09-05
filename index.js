const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

// Inicializa Express
const app = express();

// Configuración CORS para tu frontend Firebase
app.use(cors({
  origin: [
    'https://doraemon-chat-84c5f.web.app',
    'https://doraemon-chat-84c5f.firebaseapp.com',
    'http://localhost:5000'
  ],
  methods: ['GET', 'POST'],
}));

app.use(bodyParser.json());

// Configura el cliente OpenAI Hugging Face con tu token
const openai = new OpenAI({
  apiKey: process.env.TOKEN_HUGGINGFACE  // token guardado como variable de entorno en Render
});

app.get('/', (req, res) => {
  res.send('Doraemon IA backend activo 🚀');
});

app.post('/chat', async (req, res) => {
  try {
    const mensajeUsuario = req.body.mensaje;
    if (!mensajeUsuario) throw new Error('Falta mensaje');

    // Llamada a Hugging Face Mistral con chat completions
    const completion = await openai.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai",
      messages: [{ role: "user", content: mensajeUsuario }]
    });

    const respuestaIA = completion.choices[0].message.content;

    res.json({ respuesta: respuestaIA });
  } catch (error) {
    console.error('Error en /chat:', error);
    res.json({ error: "Lo siento, no puedo responder ahora." });
  }
});

// Puerto automático para Render
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Servidor Doraemon backend escuchando en puerto ${PORT}`);
});
