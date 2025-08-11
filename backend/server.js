// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

// Ruta de prueba para saber si el servidor está vivo
app.get('/', (req, res) => {
  res.send('El servidor de tareas está funcionando correctamente!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});