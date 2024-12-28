import React, { useState } from 'react';
import './AddMedicinePopup.css';

const AddMedicinePopup = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [salt, setSalt] = useState('');
  const [quantity, setQuantity] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name || !quantity) {
      setError('Name and Quantity are required.');
      return;
    }
    const medicineDetails = { name, salt, quantity, manufacturer };
    onAdd(medicineDetails);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Add Medicine</h2>
        {error && <p className="error">{error}</p>}
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name of the medicine" 
        />
        <input 
          type="text" 
          value={salt} 
          onChange={(e) => setSalt(e.target.value)} 
          placeholder="Salt of the medicine" 
        />
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          placeholder="Quantity" 
        />
        <input 
          type="text" 
          value={manufacturer} 
          onChange={(e) => setManufacturer(e.target.value)} 
          placeholder="Manufactured by" 
        />
        <div className="button-group">
          <button onClick={handleSubmit}>Add</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AddMedicinePopup;
