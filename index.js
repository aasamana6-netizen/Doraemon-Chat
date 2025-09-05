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
  methods: ['GET', 'POST'],
}));
app.use(bodyParser.json());

const openai = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.TOKEN
});

const modeloIA = "tiiuae/falcon-7b-instruct";

app.get('/', (req, res) => {
  res.send('Doraemon IA backend activo 🚀');
});

app.post('/chat', async (req, res) => {
  const mensajeUsuario = req.body.mensaje;
  if (!mensajeUsuario) {
    // RESPONDE SIEMPRE aunque falte mensaje
    return res.json({ respuesta: "Debes escribir un mensaje antes de enviar." });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: modeloIA,
      messages: [{ role: "user", content: mensajeUsuario }]
    });
    const respuestaIA = completion.choices[0]?.message?.content;
    // RESPONDE SIEMPRE aunque completion no tenga respuesta
    res.json({ respuesta: respuestaIA || "No se obtuvo respuesta de la IA, intenta más tarde." });
  } catch (error) {
    // RESPONDE SIEMPRE aunque haya error (HuggingFace, token, modelo, etc.)
    res.json({ respuesta: "Error en la IA: " + (error.message || "desconocido") });
  }
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Servidor Doraemon backend escuchando en puerto ${PORT}`);
});
