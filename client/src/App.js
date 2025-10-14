import React, { useEffect, useState } from "react";
import {
  Container, Typography, Box, Paper, IconButton, InputBase, Button, Divider
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import TodoList from "./components/TodoList";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchTodos() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Fetch todos error", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTodos(); }, []);

  async function addTodo() {
    if (!text.trim()) return;
    const res = await fetch(`${API}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    if (res.ok) {
      const newTodo = await res.json();
      setTodos(prev => [newTodo, ...prev]);
      setText("");
    }
  }

  async function toggleTodo(id, completed) {
    const res = await fetch(`${API}/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed })
    });
    if (res.ok) {
      const updated = await res.json();
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    }
  }

  async function deleteTodo(id) {
    const res = await fetch(`${API}/api/todos/${id}`, { method: "DELETE" });
    if (res.status === 204) setTodos(prev => prev.filter(t => t.id !== id));
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#070707', color: '#eee', py: 8 }}>
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 1 }}>
          Focus on what matters
        </Typography>
        <Typography align="center" sx={{ opacity: 0.7, mb: 4 }}>
          A simple, elegant way to organize your tasks and boost productivity.
        </Typography>

        <Paper sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, mb: 3, bgcolor: '#0f0f0f', borderRadius: 3 }}>
          <InputBase
            placeholder="Add a new task..."
            fullWidth
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTodo()}
            sx={{ pl: 2, color: '#ddd' }}
          />
          <Divider orientation="vertical" flexItem sx={{ bgcolor: '#1f1f1f' }} />
          <Button variant="contained" onClick={addTodo} startIcon={<AddIcon />} sx={{ ml: 1 }}>
            Add
          </Button>
        </Paper>

        <Paper sx={{ p: 4, borderRadius: 3, minHeight: 200, bgcolor: '#0d0d0d', opacity: 0.95 }}>
          <TodoList
            todos={todos}
            loading={loading}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </Paper>
      </Container>
    </Box>
  );
}
