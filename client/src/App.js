
// to get routes to work:
// in terminal, run the following in the root dir of the proj (i.e. /travel-app):
// "npm i -D react-router-dom@latest" 
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Homepage from './pages/Homepage';
//import FlightSearch from './pages/FlightSearch';
// Import other page components as needed

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;