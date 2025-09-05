import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';

const app = express();

app.use(cors({
  origin: [
    'https://doraemon-chat-84c5f.web.app',
    'https://doraemon-chat-84c5f.firebaseapp.com',
    'http://localhost:5000'
  ],
  methods: ['GET', 'POST']
}));
app.use(bodyParser.json());

const openai = new OpenAI({
  baseURL: "https://api-inference.huggingface.co",
  apiKey: process.env.TOKEN
});

// ESTE ES EL MODELO QUE SÍ FUNCIONA CON CHAT COMPLETIONS
const modeloIA = "microsoft/DialoGPT-medium";

app.get('/', (req, res) => {
  res.send('Doraemon IA backend activo 🚀');
});

app.post('/chat', async (req, res) => {
  try {
    const mensajeUsuario = req.body.mensaje;
    if (!mensajeUsuario) {
      return res.json({ respuesta: "Debes escribir un mensaje antes de enviar." });
    }

    const completion = await openai.chat.completions.create({
      model: modeloIA,
      messages: [{ role: "user", content: mensajeUsuario }],
      max_tokens: 150
    });

    const respuestaIA = completion.choices?.message?.content;
    res.json({ respuesta: respuestaIA || "No se obtuvo respuesta de la IA, intenta más tarde." });

  } catch (error) {
    console.error('Error completo:', error);
    res.json({ respuesta: "Error en la IA: " + (error.message || "desconocido") });
  }
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Servidor Doraemon backend escuchando en puerto ${PORT}`);
});
