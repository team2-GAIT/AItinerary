// client/src/pages/GeneratedTrip.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/GeneratedTrip.css'; // Ensure you have a CSS file for styling

const GeneratedTrip = () => {
  const location = useLocation();
  const { location: userLocation, destination, modeOfTravel, interests } = location.state || {};
  const [itinerary, setItinerary] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch('/api/generate-itinerary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            travelDetails: {
              destination: destination === 'RANDOM' ? getRandomDestination() : destination,
              interests,
            },
            modeOfTravel,
            source: userLocation
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setItinerary(data.itinerary);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch itinerary.');
      }
    };

    fetchItinerary();
  }, [userLocation, destination, modeOfTravel, interests]);

  const getRandomDestination = () => {
    const destinations = ['Paris', 'Tokyo', 'New York', 'Sydney', 'Cairo'];
    return destinations[Math.floor(Math.random() * destinations.length)];
  };

  const splitItinerary = itinerary.split('###');

  return (
    <div className="generatedTrip">
      <h1>Your Generated Trip</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <div className="description">
            <h2>Description</h2>
            <p>{splitItinerary[0]}</p>
          </div>
          <div className="activities">
            <h2>Activities:</h2>
            <ul>
              {splitItinerary.slice(1).map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default GeneratedTrip;