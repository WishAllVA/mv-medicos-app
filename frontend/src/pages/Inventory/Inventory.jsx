import React, { useState, useEffect } from 'react'
import './Inventory.css'
import MedicinePopup from './MedicinePopup.jsx'
import AddMedicinePopup from './AddMedicinePopup.jsx'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import axiosInstance from '../../axiosConfig'

const Inventory = () => {
  const [medicines, setMedicines] = useState([])
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  useEffect(() => {
    const fetchMedicines = async () => {
      const offset = (currentPage - 1) * limit
      try {
        const response = await axiosInstance.get(`/api/inventory?sort=name&limit=${limit}&offset=${offset}`)
        setMedicines(response.data.medicines)
        setTotalPages(Math.ceil(response.data.totalCount / limit))
      } catch (error) {
        console.error('Error:', error)
      }
    };

    fetchMedicines()
  }, [currentPage])

  const addMedicine = async (medicineDetails) => {
    try {
      const response = await axiosInstance.post('/api/inventory/add', medicineDetails)
      const newMedicine = response.data
      const offset = (currentPage - 1) * limit
      const fetchUpdatedMedicines = async () => {
        try {
          const response = await axiosInstance.get(`/api/inventory?sort=name&limit=${limit}&offset=${offset}`)
          setMedicines(response.data.medicines)
          setTotalPages(Math.ceil(response.data.totalCount / limit))
        } catch (error) {
          console.error('Error:', error)
        }
      }
      fetchUpdatedMedicines()
      setIsAddPopupOpen(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const removeMedicine = async (index) => {
    const medicineToRemove = medicines[index]
    try {
      const response = await axiosInstance.delete(`/api/inventory/${medicineToRemove.id}`)
      const newMedicines = medicines.filter((_, i) => i !== index)
      setMedicines(newMedicines)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const showMedicineInfo = (medicine) => {
    setSelectedMedicine(medicine);
  }

  const closePopup = () => {
    setSelectedMedicine(null);
  }

  return (
    <div className="inventory">
      <h1>Inventory</h1>
      <div className="add-medicine">
        <button className="add-medicine-button" onClick={() => setIsAddPopupOpen(true)}>Add Medicine</button>
      </div>
      <ul className="medicine-list">
        {medicines && medicines.map((medicine, index) => (
          <li key={index} onClick={() => showMedicineInfo(medicine)}>
            <span>{medicine.name}</span>
            <span>Quantity: {medicine.quantity}</span>
            <span>MRP: ₹{medicine.mrp}</span>
            <button className="remove-button" onClick={(e) => { e.stopPropagation(); removeMedicine(index); }}>Remove</button>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button className="pagination-button" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          <FaArrowLeft />
        </button>
        <span>{currentPage} of {totalPages}</span>
        <button className="pagination-button" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          <FaArrowRight />
        </button>
      </div>
      {selectedMedicine && (
        <MedicinePopup medicine={selectedMedicine} onClose={closePopup} />
      )}
      {isAddPopupOpen && (
        <AddMedicinePopup onAdd={addMedicine} onClose={() => setIsAddPopupOpen(false)} />
      )}
    </div>
  );
}

export default Inventory
