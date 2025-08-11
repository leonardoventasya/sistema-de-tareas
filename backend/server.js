// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARE ---
// 1. Habilitar CORS para aceptar peticiones de cualquier origen.
app.use(cors());

// 2. Habilitar el "traductor" de JSON. ¡ESTA ES LA LÍNEA CLAVE!
// Debe estar ANTES de que se definan las rutas.
app.use(express.json());

// --- RUTAS ---
const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});