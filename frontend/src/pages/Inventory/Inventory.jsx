import React, { useState } from 'react'
import './Inventory.css'
import MedicinePopup from './MedicinePopup.jsx'
import AddMedicinePopup from './AddMedicinePopup.jsx' // Import the new component

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

  const addMedicine = (medicineDetails) => {
    setMedicines([...medicines, medicineDetails]);
    setIsAddPopupOpen(false);
  };

  const removeMedicine = (index) => {
    const newMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(newMedicines);
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
