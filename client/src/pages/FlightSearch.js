import React, { useState } from 'react';
import '../styles/FlightSearch.css'; 

const FlightSearch = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFlights = async () => {
    // Reset previous error and set loading
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/flights?source=${source}&destination=${destination}&date=${date}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }

      const data = await response.json();
      setFlights(data.itineraries || []);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setError(error.message);
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flight-search">
      <h1>Flight Search</h1>
      <div>
        <label>
          Source Airport ID:
          <input type="text" value={source} onChange={(e) => setSource(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Destination Airport ID:
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Date (YYYY-MM-DD):
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <button onClick={fetchFlights} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search Flights'}
      </button>

      {error && <p style={{color: 'red'}}>{error}</p>}

      <div>
        <h2>Results</h2>
        {isLoading && <p>Loading flights...</p>}
        {!isLoading && flights.length === 0 && <p>No results yet.</p>}
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
      </div>
    </div>
  );
};

export default FlightSearch;