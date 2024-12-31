import React, { useState, useEffect } from 'react';
import './EditMedicinePopup.css';

const EditMedicinePopup = ({ medicine, onEdit, onClose }) => {
  const [name, setName] = useState('');
  const [salt, setSalt] = useState('');
  const [quantity, setQuantity] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [mrp, setMrp] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (medicine) {
      setName(medicine.name || '');
      setSalt(medicine.salt || '');
      setQuantity(medicine.quantity || '');
      setManufacturer(medicine.manufacturer || '');
      setMrp(medicine.price || '');
    }
  }, [medicine]);

  const handleSubmit = () => {
    if (!name || !quantity) {
      setError('Name and Quantity are required.');
      return;
    }
    const updatedMedicineDetails = { ...medicine, name, salt, quantity, manufacturer, price: mrp };
    onEdit(updatedMedicineDetails);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Edit Medicine</h2>
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
        <input 
          type="number" 
          value={mrp} 
          onChange={(e) => setMrp(e.target.value)} 
          placeholder="MRP" 
        />
        <div className="button-group">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EditMedicinePopup;
