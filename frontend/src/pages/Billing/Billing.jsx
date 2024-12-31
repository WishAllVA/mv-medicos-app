import React, { useState, useEffect } from 'react';
import './Billing.css';
import NewBillPopup from './NewBillPopup';
import axiosInstance from '../../axiosConfig';

const getStartEndDate = (filter) => {
  let startDate = '';
    let endDate = '';
    if (filter === 'today') {
      const today = new Date();
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
    } else if (filter === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).toISOString();
      endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1).toISOString();
    } else if (filter === 'thisWeek') {
      const today = new Date();
      // startOfTheWeek should be the previous Monday or today if today is Monday
      const startOfWeek = new Date(today.setDate(today.getDate() - (today.getDay() + 6) % 7));
      startDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate()).toISOString();
      endDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 7).toISOString();
    } else if (filter === 'thisMonth') {
      const today = new Date();
      // startOfTheMonth should be the first day of the current month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), startOfMonth.getDate()).toISOString();
      endDate = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, startOfMonth.getDate()).toISOString();
    } else if (filter === 'custom') {
      startDate = new Date(startDate).toISOString();
      endDate = new Date(endDate).toISOString();
    }
    return { startDate, endDate };
}

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newBill, setNewBill] = useState({
    patientName: '',
    medicines: [{ name: '', quantity: 0, price: 0 }],
    amount: 0,
    discount: 0,
    paymentMode: 'cash',
  });
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    console.log(filter)
    const { startDate, endDate } = getStartEndDate(filter);
    const query = `/api/bills?start=${startDate}&end=${endDate}`;
    axiosInstance.get(query, {
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
  }, [filter]);

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

  const handleSubmit = async (paymentMode) => {
    console.log(newBill)
    if (newBill.medicines.length === 0 || newBill.medicines.some(med => !med.name || med.quantity <= 0 || med.price <= 0)) {
      setError("Please add at least one valid medicine.");
      return
    }
    const discount = Number(newBill.discount) || 0;
    const totalAmount = calculateTotal(newBill.medicines);
    const newBillWithTime = { 
      ...newBill, 
      time: new Date(), 
      amount: (totalAmount - discount).toFixed(2), 
      paymentMode 
    };
    try {
      const response = await axiosInstance.post('/api/bills/add', newBillWithTime)
      setBills([...bills, response.data.bill])
      setShowPopup(false)
      setNewBill({ 
        patientName: '', 
        medicines: [{ name: '', quantity: 0, price: 0 }], 
        amount: 0, 
        discount: 0, 
        paymentMode: 'cash' 
      })
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
    return medicines.reduce((total, medicine) => total + medicine.quantity * medicine.price, 0).toFixed(2);
  }

  return (
    <div className="billing-page">
      <h1>Billing</h1>
      <div className="controls-container">
        <button className='show-bill' onClick={() => setShowPopup(true)}>Create New Bill</button>
        <div className="filter-container">
          <label htmlFor="filter">Filter by: </label>
          <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="custom">Custom</option>
            <option value="all">All</option>
          </select>
          {/* {filter === 'custom' && (
            <div className="date-range">
              <label htmlFor="start-date">Start Date: </label>
              <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <label htmlFor="end-date">End Date: </label>
              <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          )} */}
        </div>
      </div>
      <div className="bills-list">
        {bills
          .slice()
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .map((bill, index) => (
            <div key={index} className="bill-card">
              <h2 className="bill-title">{bill.patientName}</h2>
              <p className="bill-time">{new Date(bill.time).toLocaleString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}</p>
              <ul className="bill-medicines">
                {bill.medicines.map((medicine, i) => (
                  <li key={i}>
                    {medicine.name} - {medicine.quantity} x ₹{medicine.price}
                  </li>
                ))}
              </ul>
              <p className="bill-total">Total: ₹{(calculateTotal(bill.medicines) - (Number(bill.discount) || 0)).toFixed(2)}</p>
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
