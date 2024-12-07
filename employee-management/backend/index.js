const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure PostgreSQL pool with environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Initialize the database and create the table if it doesn't exist
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        employee_id VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone_number VARCHAR(20),
        department VARCHAR(100),
        date_of_joining DATE,
        role VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Call initDb when starting the server
initDb();

// POST endpoint to add a new employee
app.post('/api/employees', async (req, res) => {
  const { name, employeeId, email, phoneNumber, department, dateOfJoining, role } = req.body;

  // Validate input fields
  if (!name || !employeeId || !email || !phoneNumber || !department || !dateOfJoining || !role) {
    return res.status(400).send('All fields are required');
  }

  try {
    // Format the date for PostgreSQL
    const formattedDate = new Date(dateOfJoining).toISOString().split('T')[0];

    // Insert the employee into the database
    const result = await pool.query(
      `INSERT INTO employees (name, employee_id, email, phone_number, department, date_of_joining, role) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, employeeId, email, phoneNumber, department, formattedDate, role]
    );

    res.status(201).json(result.rows[0]); // Return the newly created employee
  } catch (error) {
    console.error('Error adding employee:', error);

    // Handle duplicate entry errors
    if (error.code === '23505') {
      return res.status(400).send('Employee ID or Email already exists');
    }

    // Handle other server errors
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// Endpoint to retrieve all employees
app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).send('Server error');
  }
});

// Graceful shutdown to release database connections
process.on('SIGINT', async () => {
  await pool.end();
  console.log('Database pool has been closed');
  process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
