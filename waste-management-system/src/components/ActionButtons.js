
import '../styles/App.css';// src/components/ActionButtons.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ActionButtons = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleViewReports = () => {
    navigate('/reports'); // Navigate to the ReportPage
  };

  const handleSchedulePickup = () => {
    navigate('/schedule-pickup'); // Navigate to the SchedulePickup page
  };

  return (
    <div className="action-buttons">
      <button className="btn btn-green" onClick={handleSchedulePickup}>Schedule Pickup 🚚</button>
      <button className="btn btn-gray" onClick={handleViewReports}>View Reports 📊</button>
    </div>
  );
};

export default ActionButtons;
