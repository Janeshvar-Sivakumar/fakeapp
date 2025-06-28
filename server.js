const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection - ERROR 1: Missing error handling
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'testdb'
});

// ERROR 2: No connection verification
db.connect();

// ERROR 3: Missing authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);
    
    // ERROR 4: JWT_SECRET is hardcoded and should be from environment
    jwt.verify(token, 'supersecretkey', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    // ERROR 5: No input validation
    // ERROR 6: SQL injection vulnerability
    const query = `SELECT * FROM users WHERE username = '${username}'`;
    
    db.query(query, async (err, results) => {
        if (err) {
            // ERROR 7: Exposing database errors to client
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = results[0];
        
        // ERROR 8: No try-catch around bcrypt.compare
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // ERROR 9: JWT_SECRET hardcoded again
        const token = jwt.sign(
            { id: user.id, username: user.username },
            'supersecretkey',
            { expiresIn: '24h' }
        );
        
        res.json({ token, user: { id: user.id, username: user.username } });
    });
});

// Get all users - ERROR 10: No authentication required for sensitive data
app.get('/api/users', (req, res) => {
    // ERROR 11: Selecting sensitive data including passwords
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Get user by ID
app.get('/api/users/:id', authenticateToken, (req, res) => {
    const userId = req.params.id;
    
    // ERROR 12: Another SQL injection vulnerability
    const query = `SELECT id, username, email, created_at FROM users WHERE id = ${userId}`;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // ERROR 13: No check if user exists
        res.json(results[0]);
    });
});

// Create user endpoint
app.post('/api/users', async (req, res) => {
    const { username, email, password } = req.body;
    
    // ERROR 14: No input validation again
    
    try {
        // ERROR 15: Salt rounds hardcoded and too low
        const hashedPassword = await bcrypt.hash(password, 8);
        
        // ERROR 16: SQL injection in INSERT statement
        const query = `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${hashedPassword}')`;
        
        db.query(query, (err, results) => {
            if (err) {
                // ERROR 17: Exposing database errors again
                return res.status(500).json({ error: err.message });
            }
            
            res.status(201).json({ 
                message: 'User created successfully', 
                userId: results.insertId 
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user endpoint
app.delete('/api/users/:id', authenticateToken, (req, res) => {
    const userId = req.params.id;
    
    // ERROR 18: No authorization check (user can delete any user)
    // ERROR 19: SQL injection again
    const query = `DELETE FROM users WHERE id = ${userId}`;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // ERROR 20: No check if user was actually deleted
        res.json({ message: 'User deleted successfully' });
    });
});

// ERROR 21: No graceful shutdown handling
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// ERROR 22: No global error handler
// ERROR 23: No process error handling
