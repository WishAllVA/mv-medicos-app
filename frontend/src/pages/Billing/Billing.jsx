import React, { useState } from 'react';
import './Billing.css';
import NewBillPopup from './NewBillPopup';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newBill, setNewBill] = useState({
    patientName: '',
    medicines: [{ name: '', quantity: 0, price: 0 }],
  });
  const [error, setError] = useState('');

  const handleAddMedicine = () => {
    setNewBill({
      ...newBill,
      medicines: [...newBill.medicines, { name: '', quantity: 0, price: 0 }],
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = newBill.medicines.map((medicine, i) =>
      i === index ? { ...medicine, [field]: value } : medicine
    );
    setNewBill({ ...newBill, medicines: updatedMedicines });
  };

  const handleSubmit = () => {
    if (newBill.medicines.length === 0 || newBill.medicines.some(med => !med.name || med.quantity <= 0 || med.price <= 0)) {
      setError("Please add at least one valid medicine.");
      return;
    }
    const newBillWithTime = { ...newBill, time: new Date() };
    setBills([...bills, newBillWithTime]);
    setShowPopup(false);
    setNewBill({ patientName: '', medicines: [{ name: '', quantity: 0, price: 0 }] });
    setError('');
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setNewBill({ patientName: '', medicines: [{ name: '', quantity: 0, price: 0 }] });
  };

  const calculateTotal = (medicines) => {
    return medicines.reduce((total, medicine) => total + medicine.quantity * medicine.price, 0);
  };

  return (
    <div className="billing-page">
      <h1>Billing</h1>
      <button className='show-bill' onClick={() => setShowPopup(true)}>Create New Bill</button>
      <div className="bills-list">
        {bills
          .slice()
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .map((bill, index) => (
            <div key={index} className="bill-card">
              <h2>{bill.patientName}</h2>
              <p className="bill-time">{new Date(bill.time).toLocaleString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}</p>
              <ul>
                {bill.medicines.map((medicine, i) => (
                  <li key={i}>
                    {medicine.name} - {medicine.quantity} x ₹{medicine.price}
                  </li>
                ))}
              </ul>
              <p>Total: ₹{calculateTotal(bill.medicines)}</p>
            </div>
          ))}
      </div>
      {showPopup && (
        <NewBillPopup
          newBill={newBill}
          setNewBill={setNewBill}
          handleAddMedicine={handleAddMedicine}
          handleMedicineChange={handleMedicineChange}
          handleSubmit={handleSubmit}
          setShowPopup={handleClosePopup}
          error={error}
        />
      )}
    </div>
  );
};

export default Billing;
