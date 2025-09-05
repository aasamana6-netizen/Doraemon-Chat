const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

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

    if (!completion || !completion.choices || completion.choices.length === 0) {
      return res.status(500).json({ error: 'Error: La IA no generó respuesta.' });
    }

    const respuestaIA = completion.choices[0].message.content;
    res.json({ respuesta: respuestaIA });

  } catch (error) {
    console.error('Error en /chat:', error);

    // Mensajes personalizados según tipo de error
    if (error.message.includes('401')) {
      return res.status(401).json({ error: 'Error 401: Token inválido o sin permisos de inferencia.' });
    } else if (error.message.includes('404')) {
      return res.status(404).json({ error: 'Error 404: Modelo no encontrado o incorrecto.' });
    } else if (error.message.includes('422')) {
      return res.status(422).json({ error: 'Error 422: Petición mal formulada o inválida.' });
    } else if (error.message.includes('ECONNREFUSED')) {
      return res.status(503).json({ error: 'Error: No se pudo conectar con el servicio de inferencia.' });
    } else {
      return res.status(500).json({ error: 'Error inesperado: ' + error.message });
    }
  }
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Servidor Doraemon backend escuchando en puerto ${PORT}`);
});
