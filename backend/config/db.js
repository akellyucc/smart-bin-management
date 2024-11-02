const mysql = require('mysql');

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10,  // Adjust the limit based on your needs
  host: '127.0.0.1',    // Replace with your MySQL host, e.g., '127.0.0.1'
  user: 'root',         // Your MySQL username
  password: 'Visa@198!', // Your MySQL password
  database: 'waste_management', // Your MySQL database name
});

// Function to connect to the database
const connectDB = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject('Error connecting to the database: ' + err.message);
      } else {
        console.log('Connected to the MySQL database');
        resolve(connection);
        connection.release();  // Release connection back to the pool
      }
    });
  });
};

// Function to execute queries
const queryDB = (query, values) => {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  connectDB,
  queryDB,
};
