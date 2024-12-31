import React, { useState, useEffect } from 'react'
import './Inventory.css'
import MedicinePopup from './MedicinePopup.jsx'
import AddMedicinePopup from './AddMedicinePopup.jsx'
import EditMedicinePopup from './EditMedicinePopup.jsx'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import axiosInstance from '../../axiosConfig'

const Inventory = () => {
  const [medicines, setMedicines] = useState([])
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false)
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false)
  const [medicineToEdit, setMedicineToEdit] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchBy, setSearchBy] = useState('name')
  const limit = 10

  useEffect(() => {
    const fetchMedicines = async () => {
      const offset = (currentPage - 1) * limit
      try {
        const response = await axiosInstance.get(`/api/inventory?sort=name&limit=${limit}&offset=${offset}&search=${searchQuery}&searchBy=${searchBy}`)
        const medicinesToSet = response.data.medicines.map((medicine) => {
          return {
            ...medicine.medicine,
            quantity: medicine.quantity,
            inventoryId: medicine._id
          }
        })
        setMedicines(medicinesToSet)
        setTotalPages(Math.ceil(response.data.totalCount / limit))
      } catch (error) {
        console.error('Error:', error)
      }
    };

    fetchMedicines()
  }, [currentPage, searchQuery, searchBy])

  const addMedicine = async (medicineDetails) => {
    try {
      const response = await axiosInstance.post('/api/inventory/add', medicineDetails)
      const newMedicine = response.data
      const offset = (currentPage - 1) * limit
      const fetchUpdatedMedicines = async () => {
        try {
          const response = await axiosInstance.get(`/api/inventory?sort=name&limit=${limit}&offset=${offset}`)
          const medicinesToSet = response.data.medicines.map((medicine) => {
            return {
              ...medicine.medicine,
              quantity: medicine.quantity,
              inventoryId: medicine._id
            }
          })
          setMedicines(medicinesToSet)
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

  const editMedicine = async (medicineDetails) => {
    try {
      const response = await axiosInstance.put(`/api/inventory/update/${medicineDetails.inventoryId}`, medicineDetails)
      const updatedMedicine = response.data
      setMedicines((prevMedicines) =>
        prevMedicines.map((medicine) =>
          medicine.inventoryId === updatedMedicine._id ? { ...medicine, medicine: updatedMedicine.medicine, inventoryId: updatedMedicine._id } : medicine
        )
      )
      setIsEditPopupOpen(false)
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

  const openEditPopup = (medicine) => {
    setMedicineToEdit(medicine)
    setIsEditPopupOpen(true)
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
      <div className="search-medicine">
        <select className="search-dropdown" value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
          <option value="name">Medicine Name</option>
          <option value="salt">Salt</option>
          <option value="manufacturer">Manufacturer</option>
        </select>
        <input 
          type="text" 
          className="search-input"
          placeholder="Search medicine..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>
      <ul className="medicine-list">
        <li className="medicine-list-header">
          <span>Medicine Name</span>
          <span>Quantity</span>
          <span>MRP</span>
          <span></span> {/* Empty span for the buttons column */}
        </li>
        {medicines && medicines.map((medicine, index) => (
          <li key={index} onClick={() => showMedicineInfo(medicine)}>
            <span>{medicine.name}</span>
            <span>{medicine.quantity}</span>
            <span>₹{medicine.price}</span>
            <span>
              <button className="edit-button" onClick={(e) => { e.stopPropagation(); openEditPopup(medicine); }}>Edit</button>
              <button className="remove-button" onClick={(e) => { e.stopPropagation(); removeMedicine(index); }}>Remove</button>
            </span>
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
      {isEditPopupOpen && (
        <EditMedicinePopup medicine={medicineToEdit} onEdit={editMedicine} onClose={() => setIsEditPopupOpen(false)} />
      )}
    </div>
  );
}

export default Inventory
