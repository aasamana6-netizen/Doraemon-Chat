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

const modeloIA = "mistralai/Mistral-7B-Instruct-v0.2";

app.get('/', (req, res) => {
  res.send('Doraemon IA backend activo 🚀');
});

app.post('/chat', async (req, res) => {
  try {
    const mensajeUsuario = req.body.mensaje;
    if (!mensajeUsuario) {
      return res.status(400).json({ error: 'Error: Falta el mensaje en la petición.' });
    }

    const completion = await openai.chat.completions.create({
      model: modeloIA,
      messages: [{ role: "user", content: mensajeUsuario }]
    });

    const respuestaIA = completion.choices[0].message.content;
    res.json({ respuesta: respuestaIA });

  } catch (error) {
    let mensajePersonalizado = 'Error inesperado.';
    if (error.message.includes('401')) {
      mensajePersonalizado = 'Token inválido o sin permisos de inferencia.';
    } else if (error.message.includes('404')) {
      mensajePersonalizado = 'Modelo no encontrado o incorrecto.';
    } else if (error.message.includes('422')) {
      mensajePersonalizado = 'Petición mal formulada o inválida.';
    } else if (error.message.includes('ECONNREFUSED')) {
      mensajePersonalizado = 'No se pudo conectar con el servicio de inferencia.';
    }
    res.json({ error: mensajePersonalizado });
  }
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Servidor Doraemon backend escuchando en puerto ${PORT}`);
});
