import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/GeneratedTrip.css';

const GeneratedTrip = () => {
  const location = useLocation();
  const { location: userLocation, destination, modeOfTravel, interests, sourceAirportCode, destinationAirportCode, description, activities, date } = location.state || {};
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(`/api/flights?source=${sourceAirportCode}&destination=${destinationAirportCode}&date=${date}`);
        const data = await response.json();
        setFlights(data.itineraries || []);
      } catch (error) {
        console.error('Error fetching flights:', error);
        setError('Failed to fetch flight information.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [sourceAirportCode, destinationAirportCode, date]);

  return (
    <div className="generatedTrip">
      <div className="tripDetails">
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
      </div>
      <div className="flightDetails">
        <h2>Flight Details</h2>
        {loading ? (
          <div className="loader">
            <span></span>
            <div id="dot-1" className="dot"></div>
            <div id="dot-2" className="dot"></div>
            <div id="dot-3" className="dot"></div>
            <div id="dot-4" className="dot"></div>
            <div id="dot-5" className="dot"></div>
          </div>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : flights.length === 0 ? (
          <p>No flight information available.</p>
        ) : (
          <ul>
            {flights.map((flight, index) => (
              <li key={index}>
                <p>Price: {flight.price.formatted}</p>
                <p>Departure: {flight.legs[0].departure}</p>
                <p>Arrival: {flight.legs[0].arrival}</p>
                <p>Airline: {flight.legs[0].carriers.marketing[0]?.name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GeneratedTrip;