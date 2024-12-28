import React, { useState } from 'react';
import './NewBillPopup.css';

const NewBillPopup = ({ newBill, setNewBill, handleAddMedicine, handleMedicineChange, handleSubmit, setShowPopup, error }) => {
  const [discountType, setDiscountType] = useState('%');

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = newBill.medicines.filter((_, i) => i !== index);
    setNewBill({ ...newBill, medicines: updatedMedicines });
  };

  const calculateTotal = () => {
    const total = newBill.medicines.reduce((total, medicine) => total + medicine.quantity * medicine.price, 0);
    if (discountType === '%') {
      return total - (total * (newBill.discount || 10) / 100);
    } else {
      return total - (newBill.discount || 0);
    }
  };

  const calculateTotalBeforeDiscount = () => {
    return newBill.medicines.reduce((total, medicine) => total + medicine.quantity * medicine.price, 0);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2 className="popup-title">New Bill</h2>
        {error && <p className="error-message">{error}</p>}
        <label className="popup-label">
          Patient Name:
          <input
            type="text"
            className="popup-input"
            value={newBill.patientName}
            onChange={(e) => setNewBill({ ...newBill, patientName: e.target.value })}
          />
        </label>
        <h3 className="popup-subtitle">Medicines</h3>
        {newBill.medicines.map((medicine, index) => (
          <div key={index} className="medicine-input">
            <input
              type="text"
              className="popup-input"
              placeholder="Medicine Name"
              value={medicine.name}
              onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
            />
            <input
              type="number"
              className="popup-input"
              placeholder="Quantity"
              value={medicine.quantity}
              onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
            />
            <input
              type="number"
              className="popup-input"
              placeholder="Price"
              value={medicine.price}
              onChange={(e) => handleMedicineChange(index, 'price', e.target.value)}
            />
            <button className="popup-button remove" onClick={() => handleRemoveMedicine(index)}>Remove</button>
          </div>
        ))}
        <button className="popup-button add" onClick={handleAddMedicine}>+</button>
        <label className="popup-label">
          Discount:
          <input
            type="number"
            className="popup-input discount"
            value={newBill.discount !== undefined ? newBill.discount : 10}
            onChange={(e) => setNewBill({ ...newBill, discount: e.target.value })}
          />
          <select
            className="popup-select"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
          >
            <option value="%">%</option>
            <option value="₹">₹</option>
          </select>
        </label>
        <div className="popup-total">
          <h3>Total: ₹{calculateTotal().toFixed(2)}</h3>
          <p className="total-before-discount">Before Discount: ₹{calculateTotalBeforeDiscount().toFixed(2)}</p>
        </div>
        <div className="popup-actions">
          <button className="popup-button" onClick={handleSubmit}>Submit</button>
          <button className="popup-button cancel" onClick={() => setShowPopup(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NewBillPopup;
