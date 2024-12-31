import React, { useState, useEffect } from 'react';
import { FaTrash, FaRegCircle, FaDotCircle } from 'react-icons/fa'; // Import the icons
import './NewBillPopup.css';
import axiosInstance from '../../axiosConfig';

const NewBillPopup = ({ newBill, setNewBill, handleAddMedicine, handleMedicineChange, handleSubmit, setShowPopup, error }) => {
  const [discountType, setDiscountType] = useState('%')
  const [medicinesList, setMedicinesList] = useState([])
  const [paymentMode, setPaymentMode] = useState(newBill.paymentMode || 'cash'); // Initialize with newBill.paymentMode

  useEffect(() => {
    setNewBill({ ...newBill, paymentMode });
  }, [paymentMode]);

  useEffect(() => {
    // Fetch the list of medicines from the API
    const fetchMedicines = async () => {
      try {
        const response = await axiosInstance.get('/api/medicines?sort=name');
        setMedicinesList(response.data);
      } catch (error) {
        console.error('Failed to fetch medicines', error);
      }
    };

    fetchMedicines();
  }, []);

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = newBill.medicines.filter((_, i) => i !== index);
    setNewBill({ ...newBill, medicines: updatedMedicines });
  };

  const handleMedicineValueChange = (e, index) => {
    const selectedMedicine = medicinesList.find(med => med._id === e.target.value);
    if (selectedMedicine) {
      handleMedicineChange(index, 'name', `${selectedMedicine.name}_${selectedMedicine.price}`);
    }
  }

  const calculateTotal = () => {
    const total = newBill.medicines.reduce((total, medicine) => total + medicine.quantity * medicine.price, 0);
    const discount = Number(newBill.discount) || 0;
    if (discountType === '%') {
      return (total - (total * discount / 100)).toFixed(2);
    } else {
      return (total - discount).toFixed(2);
    }
  };

  const calculateTotalBeforeDiscount = () => {
    return newBill.medicines.reduce((total, medicine) => total + medicine.quantity * medicine.price, 0).toFixed(2);
  }

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
            value={newBill.patientName || ''}
            onChange={(e) => setNewBill({ ...newBill, patientName: e.target.value })}
          />
        </label>
        <h3 className="popup-subtitle">Medicines</h3>
        <div className="medicine-input">
          <label className="medicine-label-inline">Name</label>
          <label className="medicine-label-inline">Quantity</label>
          <label className="medicine-label-inline">Price</label>
        </div>
        {newBill.medicines.map((medicine, index) => (
          <div key={index} className="medicine-input">
            <select
              className="popup-input medicine-name medicine-select"
              value={medicine._id}
              onChange={(e) => handleMedicineValueChange(e, index)}
            >
              <option value="">Select Medicine</option>
              {medicinesList.map((med) => (
                <option key={med._id} value={med._id}>{med.name}</option>
              ))}
            </select>
            <input
              type="number"
              className="popup-input medicine-quantity"
              placeholder="Quantity"
              value={medicine.quantity || 0}
              onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
            />
            <input
              type="number"
              className="popup-input medicine-price"
              placeholder="Price"
              value={medicine.price || 0}
              readOnly
            />
            <button className="popup-button remove-medicine-from-bill-button" onClick={() => handleRemoveMedicine(index)}>
              <FaTrash /> {/* Use the trash icon */}
            </button>
          </div>
        ))}
        <button className="popup-button add" onClick={handleAddMedicine}>+</button>
        <label className="popup-label">
          Discount:
          <input
            type="number"
            className="popup-input discount"
            value={newBill.discount !== undefined ? newBill.discount : 0}
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
          <h3>Total: ₹{calculateTotal()}</h3>
          <p className="total-before-discount">Before Discount: ₹{calculateTotalBeforeDiscount()}</p>
        </div>
        <div className="popup-slider">
          <div className="slider-option" onClick={() => setPaymentMode('cash')}>
            {paymentMode === 'cash' ? <FaDotCircle /> : <FaRegCircle />} Cash
          </div>
          <div className="slider-option" onClick={() => setPaymentMode('online')}>
            {paymentMode === 'online' ? <FaDotCircle /> : <FaRegCircle />} Online
          </div>
        </div>
        <div className="popup-actions">
          <button className="popup-button" onClick={() => handleSubmit(paymentMode)}>Submit</button>
          <button className="popup-button cancel" onClick={() => setShowPopup(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NewBillPopup;
