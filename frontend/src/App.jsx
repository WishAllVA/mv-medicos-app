import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Inventory from './pages/Inventory/Inventory.jsx';
import Billing from './pages/Billing/Billing.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/billing" element={<Billing />} />
          {/* <Route path="/" element={<Dashboard />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
