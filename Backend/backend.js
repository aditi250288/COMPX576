// database.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 20 // Adjust this based on your needs
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    process.exit(1); // Exit the process with an error code
  }
  console.log('Connected to database.');
  connection.release(); // Release the connection back to the pool
});

module.exports = pool.promise(); // Export the pool with promise support