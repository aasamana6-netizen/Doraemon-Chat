const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Inicializa Express
const app = express();

// Configuración de CORS para Firebase Hosting y local
app.use(cors({
  origin: [
    'https://TU-PROYECTO.web.app',
    'https://TU-PROYECTO.firebaseapp.com',
    'http://localhost:5000'
  ],
  methods: ['GET', 'POST']
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

    // Aquí iría tu llamada a Hugging Face/Mistral usando fetch o axios.
    // Ejemplo simulado:
    const mensajeUsuario = req.body.mensaje || '¿Cuál es la capital de Francia?';

    // Respuesta simulada, reemplaza por la IA real:
    const respuestaIA = `Respuesta simulada a: ${mensajeUsuario}`;

    res.json({ respuesta: respuestaIA });
  } catch (error) {
    console.error('Error en /chat:', error);
    res.status(500).json({ error: 'Error interno del backend.' });
  }
});

// Puerto Render automático
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Servidor Doraemon backend escuchando en puerto ${PORT}`);
});
