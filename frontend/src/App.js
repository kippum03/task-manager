import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div>
            <h1>Task Manager</h1>
            <input 
                type="text" 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)} 
                placeholder="New Task" 
            />
            <button onClick={addTask}>Add Task</button>
            <ul>
                {tasks.map(task => (
                    <li key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={() => toggleTaskCompletion(task.id, task.completed)}
                        />
                        {task.title}
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
