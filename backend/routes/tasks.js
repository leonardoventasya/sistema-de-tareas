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
    console.error("Error en GET /api/tasks:", err.message);
    res.status(500).send('Server Error');
  }
});

// POST -> Crear una nueva tarea
router.post('/', async (req, res) => {
  try {
    const { text, due_date } = req.body;
    if (!text || !due_date) {
        return res.status(400).json({ error: 'El texto y la fecha son obligatorios.' });
    }
    const { rows } = await db.query(
      'INSERT INTO tasks (text, due_date, is_completed) VALUES ($1, $2, false) RETURNING *',
      [text, due_date]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error en POST /api/tasks:", err.message);
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
    if (rows.length === 0) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(`Error en PUT /api/tasks/${req.params.id}:`, err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE -> Eliminar una tarea
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(`Error en DELETE /api/tasks/${req.params.id}:`, err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;