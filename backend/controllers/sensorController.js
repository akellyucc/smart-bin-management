// Import necessary modules
const db = require('../config/db'); // Database connection
const { validationResult } = require('express-validator');

// Controller to handle sensor data updates
const sensorController = {

  // Update bin status based on sensor reading
  updateBinStatus: async (req, res) => {
    // Validate incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Extract bin_id and sensor data (fill level)
      const { bin_id, fill_level } = req.body;

      // Determine the status based on the fill level
      let status = fill_level >= 90 ? 'full' : 'empty';

      // Update the bin's status in the database
      const query = 'UPDATE bins SET status = ? WHERE bin_id = ?';
      const result = await db.query(query, [status, bin_id]);

      // Check if the bin was successfully updated
      if (result.affectedRows > 0) {
        return res.status(200).json({
          message: `Bin ${bin_id} status updated to ${status}`,
        });
      } else {
        return res.status(404).json({ message: `Bin ${bin_id} not found` });
      }
    } catch (error) {
      console.error('Error updating bin status:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Retrieve sensor data for a specific bin
  getBinSensorData: async (req, res) => {
    try {
      const { bin_id } = req.params;

      // Query to fetch bin data based on bin_id
      const query = 'SELECT * FROM bins WHERE bin_id = ?';
      const result = await db.query(query, [bin_id]);

      // Check if the bin exists
      if (result.length > 0) {
        return res.status(200).json(result[0]);
      } else {
        return res.status(404).json({ message: `Bin ${bin_id} not found` });
      }
    } catch (error) {
      console.error('Error fetching bin data:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

};

module.exports = sensorController;
