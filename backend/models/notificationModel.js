// Import the database connection
const db = require('../db');

const notificationModel = {

  // Get all notifications from the database
  getAllNotifications: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM notifications ORDER BY created_at DESC';
      db.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  // Get a specific notification by its ID
  getNotificationById: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM notifications WHERE id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);  // Return null if notification is not found
        }
      });
    });
  },

  // Create a new notification
  createNotification: (notificationData) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO notifications (bin_id, message, status) VALUES (?, ?, ?)';
      const { bin_id, message, status } = notificationData;
      db.query(query, [bin_id, message, status], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.insertId);  // Return the ID of the newly created notification
      });
    });
  },

  // Update an existing notification's status
  updateNotificationStatus: (id, status) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE notifications SET status = ? WHERE id = ?';
      db.query(query, [status, id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.affectedRows);  // Return number of affected rows (should be 1 if successful)
      });
    });
  },

  // Delete a notification by its ID
  deleteNotification: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM notifications WHERE id = ?';
      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.affectedRows);  // Return number of affected rows (should be 1 if successful)
      });
    });
  }
};

module.exports = notificationModel;
