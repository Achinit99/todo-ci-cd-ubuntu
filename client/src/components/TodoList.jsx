import React from "react";
import {
  Box, Typography, List, ListItem, IconButton, ListItemText, Checkbox
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function TodoList({ todos, loading, onToggle, onDelete }) {
  if (loading) return <Typography align="center">Loading...</Typography>;

  if (!todos.length) {
    return (
      <Box textAlign="center" sx={{ py: 6, color: '#999' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6">No tasks yet</Typography>
        <Typography sx={{ mt: 1 }}>Add your first task above to get started</Typography>
      </Box>
    );
  }

  return (
    <List>
      {todos.map(todo => (
        <ListItem
          key={todo.id}
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => onDelete(todo.id)}>
              <DeleteIcon />
            </IconButton>
          }
          sx={{
            bgcolor: '#0b0b0b',
            my: 1,
            borderRadius: 2,
            px: 2
          }}
        >
          <Checkbox
            checked={!!todo.completed}
            onChange={(e) => onToggle(todo.id, e.target.checked)}
            sx={{ color: '#7b7b7b' }}
          />
          <ListItemText
            primary={todo.text}
            primaryTypographyProps={{
              sx: { textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#777' : '#eee' }
            }}
          />
        </ListItem>
      ))}
    </List>
  );
}
