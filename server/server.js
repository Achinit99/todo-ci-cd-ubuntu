const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple in-memory store (for demo)
let todos = [];

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST create todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Todo text required' });

  const newTodo = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false
  };
  todos.unshift(newTodo); // newest first
  res.status(201).json(newTodo);
});

// PUT toggle / edit todo
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  if (typeof text === 'string') todos[idx].text = text;
  if (typeof completed === 'boolean') todos[idx].completed = completed;

  res.json(todos[idx]);
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(t => t.id !== id);
  res.status(204).end();
});

// Simple health check
app.get('/', (req, res) => res.send('Todo API is running'));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
