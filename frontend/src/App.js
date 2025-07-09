// React & library imports
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // HTTP client for API requests
import { 
    Container, TextField, Button, List, 
    ListItem, ListItemText, Checkbox, IconButton, Typography 
} from '@mui/material'; // MUI components for layout & styling
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
    // State to hold list of tasks from the backend
    const [tasks, setTasks] = useState([]);

    // State to hold text input when adding a new task
    const [newTask, setNewTask] = useState('');

    // Fetch all existing tasks from backend
    useEffect(() => {
        fetchTasks();
    }, []);

    // Fetch all tasks from backend API
    const fetchTasks = () => {
        axios.get('http://localhost:3000/tasks')
            .then(response => setTasks(response.data)) // update state
            .catch(error => console.error(error)); // log errors
    };

    // Add a new task via POST to backend, then refresh list
    const addTask = () => {
        axios.post('http://localhost:3000/tasks', { title: newTask, description: '' })
            .then(() => {
                fetchTasks(); // refresh the task list
                setNewTask(''); // reset input field
            })
            .catch(error => console.error(error));
    };

    // Toggle the completion status of a task
    const toggleTaskCompletion = (id, completed) => {
        axios.put(`http://localhost:3000/tasks/${id}`, { completed: !completed })
            .then(() => fetchTasks()) // update view
            .catch(error => console.error(error));
    };

    // Delete a task by ID
    const deleteTask = (id) => {
        axios.delete(`http://localhost:3000/tasks/${id}`)
            .then(() => fetchTasks()) // update view
            .catch(error => console.error(error));
    };

    // Render the task manager interface
    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Task Manager
            </Typography>

            {/* Input field for new tasks */}
            <TextField
                fullWidth
                label="New Task"
                variant="outlined"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                sx={{ mb: 2 }}
            />

            {/* Add Task button */}
            <Button variant="contained" color="primary" fullWidth onClick={addTask}>
                Add Task
            </Button>

            {/* List of tasks */}
            <List sx={{ mt: 2 }}>
                {tasks.map(task => (
                    <ListItem key={task.id} divider>
                        {/* Checkbox for marking as complete */}
                        <Checkbox
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id, task.completed)}
                        />
                        {/* Display task title; line-through if completed */}
                        <ListItemText 
                            primary={task.title} 
                            sx={{ textDecoration: task.completed ? 'line-through' : 'none' }} 
                        />
                        {/* Delete button */}
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
