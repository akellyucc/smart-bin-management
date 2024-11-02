// Import the database connection
const db = require('../config/db');

const sensorDataModel = {

  // Get all sensor data from the database
  getAllSensorData: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM sensor_data ORDER BY timestamp DESC';
      db.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  // Get sensor data by bin_id
  getSensorDataByBinId: (bin_id) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM sensor_data WHERE bin_id = ? ORDER BY timestamp DESC';
      db.query(query, [bin_id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  // Insert new sensor data into the database
  createSensorData: (sensorData) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO sensor_data (bin_id, fullness_level, timestamp) VALUES (?, ?, ?)';
      const { bin_id, fullness_level, timestamp } = sensorData;
      db.query(query, [bin_id, fullness_level, timestamp], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.insertId);  // Return the ID of the newly inserted data
      });
    });
  },

  // Delete sensor data older than a specified time period (e.g., to clean up old data)
  deleteOldSensorData: (timeThreshold) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM sensor_data WHERE timestamp < ?';
      db.query(query, [timeThreshold], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.affectedRows);  // Return number of affected rows
      });
    });
  }
};

module.exports = sensorDataModel;
