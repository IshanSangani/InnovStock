import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Import Sidebar instead of Navbar
import Feed from './components/Feed';
import Chart from './components/Chart';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/market" element={<Chart />} />
            {/* Add routes for other components like Portfolio, Messages, Profile */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
