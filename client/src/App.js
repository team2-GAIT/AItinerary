import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Homepage from './pages/Homepage';
//import FlightSearch from './pages/FlightSearch';
// Import other page components as needed

function App() {
  return (
    <div className="App">
      {/* NavBar will appear on ALL pages */}
      <NavBar />
      
      <div className="content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default App;