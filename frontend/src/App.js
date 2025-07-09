// React & library imports
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // HTTP client for API requests
import {
    Container, TextField, Button, Paper,
    Box, Typography, Checkbox, IconButton,
    Menu, MenuItem, Divider
} from '@mui/material'; // MUI components for layout & styling
import MoreVertIcon from '@mui/icons-material/MoreVert'; // 3-dot icon for options menu

function App() {
    // State to hold list of tasks from the backend
    const [tasks, setTasks] = useState([]);

    // State to hold text input when adding a new task
    const [newTask, setNewTask] = useState('');

    // State to manage dropdown menu anchor and open task ID
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpenId, setMenuOpenId] = useState(null);

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
        if (!newTask.trim()) return;
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

    // Open options menu for a task
    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setMenuOpenId(id);
    };

    // Close the options menu
    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuOpenId(null);
    };

    // Delete and close menu
    const handleDelete = (id) => {
        deleteTask(id);
        handleMenuClose();
    };

    // Placeholder for edit behavior
    const handleEdit = (id) => {
        console.log('Edit clicked for task:', id);
        handleMenuClose();
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
            <Button variant="contained" color="primary" fullWidth onClick={addTask} sx={{ mb: 3 }}>
                Add Task
            </Button>

            {/* Task cards with checkbox and options */}
            {tasks.map(task => (
                <Paper
                    key={task.id}
                    elevation={2}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 1.5,
                        mb: 1,
                    }}
                >
                    {/* Checkbox + Title */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Checkbox
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id, task.completed)}
                        />
                        <Typography
                            sx={{
                                textDecoration: task.completed ? 'line-through' : 'none',
                                fontWeight: 500,
                            }}
                        >
                            {task.title}
                        </Typography>
                    </Box>

                    {/* 3-dot options menu (edit/delete) */}
                    <Box>
                        <IconButton onClick={(e) => handleMenuOpen(e, task.id)}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={menuOpenId === task.id}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => handleEdit(task.id)}>Edit</MenuItem>
                            <Divider />
                            <MenuItem onClick={() => handleDelete(task.id)}>Delete</MenuItem>
                        </Menu>
                    </Box>
                </Paper>
            ))}
        </Container>
    );
}

export default App;
