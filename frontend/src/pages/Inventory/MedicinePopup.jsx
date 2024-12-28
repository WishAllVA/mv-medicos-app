import React from 'react';
import './MedicinePopup.css';

const MedicinePopup = ({ medicine, onClose }) => {
    const { name, salt, quantity, manufacturer } = medicine
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Medicine Information</h2>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Salt:</strong> {salt}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p><strong>Manufacturer:</strong> {manufacturer}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default MedicinePopup
