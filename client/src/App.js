import React, { useState } from 'react';
import './App.css';

function App() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState([]);

  const fetchFlights = async () => {
    try {
      const response = await fetch(`/api/flights?source=${source}&destination=${destination}&date=${date}`);
      const data = await response.json();
      setFlights(data.itineraries || []); // Assume itineraries are returned as 'itineraries' in the response
    } catch (error) {
      console.error('Error fetching flights:', error);
      alert('Failed to fetch flights. Please try again.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
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
        <button onClick={fetchFlights}>Search Flights</button>

        <div>
          <h2>Results</h2>
          {flights.length === 0 && <p>No results yet.</p>}
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
      </header>
    </div>
  );
}

export default App;
