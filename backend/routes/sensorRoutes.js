// Import necessary modules
const express = require('express');
const { body } = require('express-validator');
const sensorController = require('../controllers/sensorController');

// Create a new router
const router = express.Router();

// Route to update bin status based on sensor data
router.post(
  '/update-status',
  [
    // Validation for incoming data
    body('bin_id').notEmpty().withMessage('Bin ID is required'),
    body('fill_level').isInt({ min: 0, max: 100 }).withMessage('Fill level must be between 0 and 100'),
  ],
  sensorController.updateBinStatus
);

// Route to get sensor data for a specific bin
router.get('/bin/:bin_id', sensorController.getBinSensorData);

module.exports = router;
