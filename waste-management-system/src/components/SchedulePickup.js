import React, { useState } from 'react';
import '../styles/SchedulePickup.css'; // Ensure you have this CSS file

const SchedulePickup = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [pickupType, setPickupType] = useState('Regular');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !time || !location || !contactName || !contactNumber) {
      setError('All fields are required.');
      return;
    }
    setSuccess(true);
    setError('');
    // Reset form after a short delay
    setTimeout(() => {
      setDate('');
      setTime('');
      setLocation('');
      setContactName('');
      setContactNumber('');
      setPickupType('Regular');
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="schedule-pickup">
      <h2>Schedule a Waste Pickup</h2>
      <form onSubmit={handleSubmit} className="pickup-form">
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Pickup scheduled successfully!</p>}

        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label>
          Time:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </label>

        <label>
          Bin Number:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter bin number"
            required
          />
        </label>

        <label>
          Contact Name:
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </label>

        <label>
          Contact Number:
          <input
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </label>

        <label>
          Pickup Type:
          <select value={pickupType} onChange={(e) => setPickupType(e.target.value)}>
            <option value="Regular">Regular</option>
            <option value="Bulk">Bulk</option>
            <option value="Electronic">Electronic</option>
          </select>
        </label>

        <button type="submit" className="btn-submit">Schedule Pickup</button>
      </form>
    </div>
  );
};

export default SchedulePickup;
