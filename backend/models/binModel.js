// Import the database connection
const db = require('../db');

const binModel = {

  // Get all bins from the database
  getAllBins: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM bins';
      db.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  // Get a specific bin by ID
  getBinById: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM bins WHERE id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);  // Return null if bin is not found
        }
      });
    });
  },

  // Create a new bin
  createBin: (binData) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO bins (bin_id, parish, latitude, longitude, status) VALUES (?, ?, ?, ?, ?)';
      const { bin_id, parish, latitude, longitude, status } = binData;
      db.query(query, [bin_id, parish, latitude, longitude, status], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.insertId);  // Return the ID of the newly created bin
      });
    });
  },

  // Update an existing bin's status or location
  updateBin: (id, binData) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE bins SET bin_id = ?, parish = ?, latitude = ?, longitude = ?, status = ? WHERE id = ?';
      const { bin_id, parish, latitude, longitude, status } = binData;
      db.query(query, [bin_id, parish, latitude, longitude, status, id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.affectedRows);  // Return number of affected rows (should be 1 if successful)
      });
    });
  },

  // Delete a bin by ID
  deleteBin: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM bins WHERE id = ?';
      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.affectedRows);  // Return number of affected rows (should be 1 if successful)
      });
    });
  }
};

module.exports = binModel;
