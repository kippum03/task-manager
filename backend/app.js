require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load environment variables
const PORT = process.env.PORT || 3000; // Fallback to 3000 if PORT is not set
const DATABASE_FILE = process.env.DATABASE_FILE || './tasks.db'; // Default database file

// Initialize SQLite database
const db = new sqlite3.Database(DATABASE_FILE, (err) => {
    if (err) console.error(err.message);
    else console.log(`Connected to SQLite database: ${DATABASE_FILE}`);
});

// Create tasks table
db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        completed BOOLEAN DEFAULT 0
    )
`);

// Define routes
app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) res.status(500).send(err.message);
        else res.json(rows);
    });
});

app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    db.run(`INSERT INTO tasks (title, description) VALUES (?, ?)`, [title, description], function(err) {
        if (err) res.status(500).send(err.message);
        else res.status(201).json({ id: this.lastID });
    });
});

// Start the server
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
