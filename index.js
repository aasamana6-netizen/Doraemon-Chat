const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

// Inicializa Express
const app = express();

// Configura CORS para permitir peticiones desde Firebase Hosting y local
app.use(cors({
  origin: [
    'https://doraemon-chat-84c5f.web.app',
    'https://doraemon-chat-84c5f.firebaseapp.com',
    'http://localhost:5000'
  ],
  methods: ['GET', 'POST']
}));

app.use(bodyParser.json());

// Inicializa cliente OpenAI con tu token de entorno TOKEN
const openai = new OpenAI({
  apiKey: process.env.TOKEN
});

// Endpoint raíz para comprobar backend activo
app.get('/', (req, res) => {
  res.send('Doraemon IA backend activo 🚀');
});

// Endpoint POST /chat que usa IA para generar respuesta
app.post('/chat', async (req, res) => {
  try {
    const mensajeUsuario = req.body.mensaje;
    if (!mensajeUsuario) {
      return res.status(400).json({ error: 'Falta el mensaje en la petición.' });
    }

    // Llamada a Hugging Face Mistral
    const completion = await openai.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai",
      messages: [{ role: "user", content: mensajeUsuario }]
    });

    const respuestaIA = completion.choices[0].message.content;
    res.json({ respuesta: respuestaIA });

  } catch (error) {
    console.error('Error en /chat:', error);
    // Envía el error real al frontend para depurar
    res.status(500).json({ error: error.message || "Lo siento, no puedo responder ahora." });
  }
});

// Puerto para Render (o 1000 local)
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Servidor Doraemon backend escuchando en puerto ${PORT}`);
});
