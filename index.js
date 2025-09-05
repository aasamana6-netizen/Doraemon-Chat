const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Inicializa Express
const app = express();

// Configuración de CORS para tu web en Firebase Hosting y desarrollo local
app.use(cors({
  origin: [
    'https://doraemon-chat-84c5f.web.app',
    'https://doraemon-chat-84c5f.firebaseapp.com',
    'http://localhost:5000'
  ],
  methods: ['GET', 'POST'],
}));

app.use(bodyParser.json());

// Endpoint raíz para comprobar el estado del backend
app.get('/', (req, res) => {
  res.send('Doraemon IA backend activo 🚀');
});

// Endpoint POST de la IA
app.post('/chat', async (req, res) => {
  try {
    console.log('Mensaje recibido:', req.body); // Log para depuración

    // Aquí va tu llamada a Hugging Face/Mistral usando fetch, axios, etc.
    // Simulación de respuesta (reemplaza con tu lógica IA):
    const mensajeUsuario = req.body.mensaje || '¿Cuál es la capital de Francia?';
    const respuestaIA = `Respuesta simulada a: ${mensajeUsuario}`;
    
    res.json({ respuesta: respuestaIA });
  } catch (error) {
    console.error('Error en /chat:', error);
    res.status(500).json({ error: 'Error interno del backend.' });
  }
});

// Puerto automático para Render
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Servidor Doraemon backend escuchando en puerto ${PORT}`);
});
