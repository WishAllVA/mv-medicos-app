import React, { useState, useEffect } from 'react';
import './Billing.css';
import NewBillPopup from './NewBillPopup';
import axiosInstance from '../../axiosConfig';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newBill, setNewBill] = useState({
    patientName: '',
    medicines: [{ name: '', quantity: 0, price: 0 }],
    amount: 0,
    discount: 0,
  })
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axiosInstance.get(`/api/bills?filter=${filter}`, {
      headers: {
        "Content-Type": 'application/json'
      }
    })
    .then(response => {
      setBills(response.data);
    })
    .catch(error => {
      console.error('Error fetching bills', error);
    });
  }, [filter])

  const handleAddMedicine = () => {
    setNewBill({
      ...newBill,
      medicines: [...newBill.medicines, { name: '', quantity: 0, price: 0 }],
    })
  }

  const handleMedicineChange = (index, field, value) => {
    const updateObject = {
      ...(
        field === 'name' ? {
          'name': value.split('_')[0],
          'price': Number(value.split('_')[1])
        } :
        field === 'quantity' || field === 'price' ? { [field]: Number(value) } : { [field]: value }
      )
    }
    const updatedMedicines = newBill.medicines.map((medicine, i) => {
      if (i === index) {
        return { ...medicine, ...updateObject }
      }
      return medicine
    })
    setNewBill((prev) => ({ ...prev, medicines: updatedMedicines }))
  }

  const handleSubmit = async () => {
    console.log(newBill)
    if (newBill.medicines.length === 0 || newBill.medicines.some(med => !med.name || med.quantity <= 0 || med.price <= 0)) {
      setError("Please add at least one valid medicine.");
      return
    }
    const discount = Number(newBill.discount) || 0;
    const totalAmount = calculateTotal(newBill.medicines);
    const newBillWithTime = { ...newBill, time: new Date(), amount: totalAmount - discount };
    try {
      const response = await axiosInstance.post('/api/bills/add', newBillWithTime)
      setBills([...bills, response.data.bill])
      setShowPopup(false)
      setNewBill({ patientName: '', medicines: [{ name: '', quantity: 0, price: 0 }], amount: 0, discount: 0 })
      setError('')
    } catch (error) {
      console.error('Error submitting new bill', error);
    }
  }

  const handleClosePopup = () => {
    setShowPopup(false);
    setNewBill({ patientName: '', medicines: [{ name: '', quantity: 0, price: 0 }], amount: 0, discount: 0 });
  }

  const calculateTotal = (medicines) => {
    return medicines.reduce((total, medicine) => total + medicine.quantity * medicine.price, 0)
  }

  return (
    <div className="billing-page">
      <h1>Billing</h1>
      <div className="controls-container">
        <button className='show-bill' onClick={() => setShowPopup(true)}>Create New Bill</button>
        <div className="filter-container">
          <label htmlFor="filter">Filter by: </label>
          <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
      </div>
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
              <p>Total: ₹{calculateTotal(bill.medicines) - (Number(bill.discount) || 0)}</p>
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
