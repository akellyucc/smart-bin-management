import React, { useState } from 'react';
import '../styles/ReportForm.css';

const ReportForm = () => {
  const [wasteType, setWasteType] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(`Reported Waste - Type: ${wasteType}, Amount: ${amount}`);
  };

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <h2>Report Waste</h2>
      <label>
        Waste Type:
        <input
          type="text"
          value={wasteType}
          onChange={(e) => setWasteType(e.target.value)}
          required
        />
      </label>
      <label>
        Amount:
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ReportForm;
