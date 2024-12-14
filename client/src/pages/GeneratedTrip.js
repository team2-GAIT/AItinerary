import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/GeneratedTrip.css'; // Ensure you have a CSS file for styling

const GeneratedTrip = () => {
  const location = useLocation();
  const { location: userLocation, destination, modeOfTravel, interests, sourceAirportCode, destinationAirportCode, description, activities } = location.state || {};

  return (
    <div className="generatedTrip">
      <h1>Your Generated Trip</h1>
      <div className="description">
        <h2>Description</h2>
        <p>{description}</p>
      </div>
      <div className="activities">
        <h2>Activities:</h2>
        <ul>
          {activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>
      <div className="airportCodes">
        <h2>Airport Codes</h2>
        <p>Source Airport Code: {sourceAirportCode}</p>
        <p>Destination Airport Code: {destinationAirportCode}</p>
      </div>
    </div>
  );
};

export default GeneratedTrip;