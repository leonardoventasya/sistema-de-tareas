const express = require('express');
const router = express.Router();
const db = require('../db');
// GET all tasks
router.get('/', async (req, res) => { /* ... código de la ruta GET ... */ });
// POST a new task
router.post('/', async (req, res) => { /* ... código de la ruta POST ... */ });
// UPDATE a task (PUT)
router.put('/:id', async (req, res) => { /* ... código de la ruta PUT ... */ });
// DELETE a task
router.delete('/:id', async (req, res) => { /* ... código de la ruta DELETE ... */ });
module.exports = router;