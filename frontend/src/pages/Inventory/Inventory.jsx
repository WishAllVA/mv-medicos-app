import React, { useState, useEffect } from 'react'
import './Inventory.css'
import MedicinePopup from './MedicinePopup.jsx'
import AddMedicinePopup from './AddMedicinePopup.jsx'

const Inventory = () => {
  const [medicines, setMedicines] = useState([])
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false)

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/inventory');
        if (response.ok) {
          const data = await response.json();
          setMedicines(data);
        } else {
          console.error('Failed to fetch medicines');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchMedicines();
  }, []);

  const addMedicine = async (medicineDetails) => {
    try {
      const response = await fetch('http://localhost:3000/api/inventory/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicineDetails),
      })
      if (response.ok) {
        const newMedicine = await response.json()
        setMedicines([...medicines, newMedicine])
        setIsAddPopupOpen(false)
      } else {
        console.error('Failed to add medicine')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  };

  const removeMedicine = async (index) => {
    const medicineToRemove = medicines[index];
    try {
      const response = await fetch(`http://localhost:3000/api/inventory/${medicineToRemove.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const newMedicines = medicines.filter((_, i) => i !== index);
        setMedicines(newMedicines);
      } else {
        console.error('Failed to remove medicine');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const showMedicineInfo = (medicine) => {
    setSelectedMedicine(medicine);
  };

  const closePopup = () => {
    setSelectedMedicine(null);
  };

  return (
    <div className="inventory">
      <h1>Inventory</h1>
      <div className="add-medicine">
        <button onClick={() => setIsAddPopupOpen(true)}>Add Medicine</button>
      </div>
      <ul className="medicine-list">
        {medicines.map((medicine, index) => (
          <li key={index} onClick={() => showMedicineInfo(medicine)}>
            <span>{medicine.name}</span>
            <button className="remove-button" onClick={(e) => { e.stopPropagation(); removeMedicine(index); }}>Remove</button>
          </li>
        ))}
      </ul>
      {selectedMedicine && (
        <MedicinePopup medicine={selectedMedicine} onClose={closePopup} />
      )}
      {isAddPopupOpen && (
        <AddMedicinePopup onAdd={addMedicine} onClose={() => setIsAddPopupOpen(false)} />
      )}
    </div>
  );
}

export default Inventory;
