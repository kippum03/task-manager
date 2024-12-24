import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.error(error));
    }, []);

    const addTask = () => {
        axios.post('http://localhost:3000/tasks', { title: newTask, description: '' })
            .then(response => {
                setTasks([...tasks, { id: response.data.id, title: newTask, description: '', completed: false }]);
                setNewTask('');
            })
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
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
