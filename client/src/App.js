
// to get routes to work:
// in terminal, run the following in the root dir of the proj (i.e. /travel-app):
// "npm i -D react-router-dom@latest" 
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Homepage from './pages/Homepage';
import FlightSearch from './pages/FlightSearch';
import GeneratedTrip from './pages/GeneratedTrip'; // Import the new component

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<FlightSearch />} />
          <Route path="/generated-trip" element={<GeneratedTrip />} /> {/* Add the new route */}
        </Routes>
      </div>
    </div>
  );
}

export default App;