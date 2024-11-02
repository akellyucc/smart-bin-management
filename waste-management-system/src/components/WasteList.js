import React from 'react';
import '../styles/WasteList.css';

const WasteList = () => {
  const wasteItems = [
    { id: 1, type: 'Plastic', amount: '20 kg' },
    { id: 2, type: 'Glass', amount: '15 kg' },
    // Add more items as needed
  ];

  return (
    <div className="waste-list">
      <h2>Waste List</h2>
      <ul>
        {wasteItems.map(item => (
          <li key={item.id}>
            <span>{item.type}</span>: <span>{item.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WasteList;
