// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- CONFIGURACIÓN DE CORS SIMPLIFICADA Y UNIVERSAL ---
// Esto le dice a nuestro servidor que acepte peticiones desde cualquier origen.
app.use(cors());

// El resto del middleware
app.use(express.json());

// Rutas
const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});