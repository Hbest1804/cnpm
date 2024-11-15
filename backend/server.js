// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

// Create an express app
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',  // Change if using a different host
    user: 'root',       // Your MySQL username
    password: '',       // Your MySQL password
    database: 'cn'    // Your MySQL database name
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Routes
app.post('/api/signup', (req, res) => {
    const { username, password, email } = req.body;
    const sql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
    db.query(sql, [username, password, email], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error registering user', error: err });
        } else {
            res.status(200).json({ message: 'User registered successfully' });
        }
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error logging in', error: err });
        } else if (result.length > 0) {
            res.status(200).json({ message: 'Login successful', user: result[0] });
        } else {
            res.status(404).json({ message: 'Invalid credentials' });
        }
    });
});

app.get('/api/cart', (req, res) => {
    // Example of fetching cart items (can be extended to your actual cart table)
    const sql = `SELECT * FROM cart WHERE user_id = ?`;
    db.query(sql, [1], (err, result) => { // Assuming user_id = 1
        if (err) {
            res.status(500).json({ message: 'Error fetching cart', error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
