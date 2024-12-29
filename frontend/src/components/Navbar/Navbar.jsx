import React from "react"
import './Navbar.css'

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-title">MV Medicos</div>
            <ul className="navbar-list">
                <li className="navbar-item"><a href="/inventory">Inventory</a></li>
                <li className="navbar-item"><a href="/billing">Billing</a></li>
                <li className="navbar-item"><a href="/reports">Reports</a></li>
            </ul>
        </nav>
    )
}

export default Navbar