// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET -> Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM tasks ORDER BY due_date ASC, id ASC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST -> Crear una nueva tarea
router.post('/', async (req, res) => {
  try {
    const { text, due_date } = req.body;
    const { rows } = await db.query(
      'INSERT INTO tasks (text, due_date) VALUES ($1, $2) RETURNING *',
      [text, due_date]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT -> Actualizar una tarea existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, due_date, is_completed } = req.body;
    const { rows } = await db.query(
      'UPDATE tasks SET text = $1, due_date = $2, is_completed = $3 WHERE id = $4 RETURNING *',
      [text, due_date, is_completed, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE -> Eliminar una tarea
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.status(204).send(); // 204 significa "sin contenido", éxito
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;