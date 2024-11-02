const sensorDataModel = require('../models/sensorDataModel');

// Example to get all sensor data in a controller method
const getAllSensorData = async (req, res) => {
  try {
    const sensorData = await sensorDataModel.getAllSensorData();
    res.status(200).json(sensorData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sensor data', error: err });
  }
};
