// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- CONFIGURACIÓN DE CORS MEJORADA ---
const whitelist = [
    'http://localhost:5173', // Para desarrollo local
    'https://tareas-frontend-hrfo.onrender.com' // <-- TU URL DE FRONTEND EN PRODUCCIÓN
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});