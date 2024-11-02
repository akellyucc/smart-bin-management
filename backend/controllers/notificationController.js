// Import necessary modules
const notificationModel = require('../models/notificationModel');
const { validationResult } = require('express-validator');

// Controller to handle notification operations
const notificationController = {

  // Get all notifications
  getAllNotifications: async (req, res) => {
    try {
      const notifications = await notificationModel.getAllNotifications();
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get a specific notification by ID
  getNotificationById: async (req, res) => {
    const { id } = req.params;
    try {
      const notification = await notificationModel.getNotificationById(id);
      if (notification) {
        res.status(200).json(notification);
      } else {
        res.status(404).json({ message: `Notification with ID ${id} not found` });
      }
    } catch (error) {
      console.error('Error fetching notification:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Create a new notification
  createNotification: async (req, res) => {
    // Validate the incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Extract notification data from request body
      const { bin_id, message, status } = req.body;

      // Create the notification in the database
      const newNotificationId = await notificationModel.createNotification({ bin_id, message, status });

      res.status(201).json({
        message: 'Notification created successfully',
        notificationId: newNotificationId
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update a notification's status (e.g., mark as read)
  updateNotificationStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;  // status can be 'read' or 'unread'

    try {
      // Update the notification status
      const affectedRows = await notificationModel.updateNotificationStatus(id, status);

      if (affectedRows > 0) {
        res.status(200).json({ message: `Notification status updated to ${status}` });
      } else {
        res.status(404).json({ message: `Notification with ID ${id} not found` });
      }
    } catch (error) {
      console.error('Error updating notification status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete a notification by ID
  deleteNotification: async (req, res) => {
    const { id } = req.params;

    try {
      // Delete the notification
      const affectedRows = await notificationModel.deleteNotification(id);

      if (affectedRows > 0) {
        res.status(200).json({ message: `Notification with ID ${id} deleted` });
      } else {
        res.status(404).json({ message: `Notification with ID ${id} not found` });
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = notificationController;
