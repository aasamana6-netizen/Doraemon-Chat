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
      return res.json({
        respuesta: "⚠️ Debes escribir un mensaje antes de enviar.",
        error_code: 400
      });
    }

    const completion = await openai.chat.completions.create({
      model: modeloIA,
      messages: [{ role: "user", content: mensajeUsuario }]
    });

    const respuestaIA = completion.choices?.message?.content;
    if (!respuestaIA) {
      return res.json({
        respuesta: "⚠️ No se pudo generar respuesta de la IA. Puede que el modelo esté saturado o hay un formato incorrecto.",
        error_code: 500
      });
    }

    res.json({ respuesta: respuestaIA, error_code: 0 });

  } catch (error) {
    let mensajePersonalizado = "⚠️ Error desconocido, intenta más tarde.";
    // Personalización según lo detecte el error/código
    if (error.message?.includes('401')) {
      mensajePersonalizado = "⛔ Token inválido o sin permisos de inferencia (401 Unauthorized).";
    } else if (error.message?.includes('404')) {
      mensajePersonalizado = "⛔ Modelo no encontrado o incorrecto (404 Not Found).";
    } else if (error.message?.includes('422')) {
      mensajePersonalizado = "⛔ Petición mal formulada o parámetros inválidos (422 Unprocessable Entity).";
    } else if (error.message?.includes('429')) {
      mensajePersonalizado = "⏳ Se ha superado el límite de peticiones o cuota en Hugging Face (429 Too Many Requests).";
    } else if (error.message?.includes('quota')) {
      mensajePersonalizado = "⏳ Límite de uso de la API alcanzado o plan gratuito bloqueado.";
    } else if (error.message?.includes('ECONNREFUSED')) {
      mensajePersonalizado = "⚡ No se pudo conectar con el servicio de inferencia. Verifica tu conexión o estado del backend.";
    } else if (error.message?.includes('input')) {
      mensajePersonalizado = "⚠️ Formato de entrada inválido, revisa el mensaje enviado.";
    } else if (error.message?.includes('Unauthorized')) {
      mensajePersonalizado = "⛔ Acceso no autorizado a Hugging Face. Revisa tu token y permisos.";
    }

    // Devolvemos siempre respuesta personalizada para mostrarla en el frontend
    res.json({
      respuesta: mensajePersonalizado,
      error_code: 500
    });
  }
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Servidor Doraemon backend escuchando en puerto ${PORT}`);
});
