import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, List, ListItem, ListItemText, Checkbox, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        axios.get('http://localhost:3000/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.error(error));
    };

    const addTask = () => {
        axios.post('http://localhost:3000/tasks', { title: newTask, description: '' })
            .then(() => {
                fetchTasks();
                setNewTask('');
            })
            .catch(error => console.error(error));
    };

    const toggleTaskCompletion = (id, completed) => {
        axios.put(`http://localhost:3000/tasks/${id}`, { completed: !completed })
            .then(() => fetchTasks())
            .catch(error => console.error(error));
    };

    const deleteTask = (id) => {
        axios.delete(`http://localhost:3000/tasks/${id}`)
            .then(() => fetchTasks())
            .catch(error => console.error(error));
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Task Manager
            </Typography>
            <TextField
                fullWidth
                label="New Task"
                variant="outlined"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" fullWidth onClick={addTask}>
                Add Task
            </Button>
            <List sx={{ mt: 2 }}>
                {tasks.map(task => (
                    <ListItem key={task.id} divider>
                        <Checkbox
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id, task.completed)}
                        />
                        <ListItemText 
                            primary={task.title} 
                            sx={{ textDecoration: task.completed ? 'line-through' : 'none' }} 
                        />
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

export default App;
