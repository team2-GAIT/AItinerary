import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../styles/GeneratedTrip.css';

const GeneratedTrip = () => {
  const location = useLocation();
  const { location: userLocation, destination, modeOfTravel, interests, sourceAirportCode, destinationAirportCode, description, activities, date, imagePath, audioPath } = location.state || {};
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (modeOfTravel === 'flight') {
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
    } else {
      // Not a flight, so no need to fetch flights
      setLoading(false);
    }
  }, [sourceAirportCode, destinationAirportCode, date, modeOfTravel]);

  useEffect(() => {
    // Make initMap available globally for the callback
    window.initMap = initializeMap;

    function initializeMap() {
      if (modeOfTravel !== 'flight' && window.google) {
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer();
        
        // Initialize the map with some default center
        const map = new window.google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: { lat: 41.85, lng: -87.65 },
        });
        directionsRenderer.setMap(map);

        // Map the modeOfTravel to a valid Google Maps TravelMode
        let travelMode = window.google.maps.TravelMode.DRIVING;
        if (modeOfTravel === 'car') {
          travelMode = window.google.maps.TravelMode.DRIVING;
        } else if (modeOfTravel === 'train') {
          travelMode = window.google.maps.TravelMode.TRANSIT;
        }

        const request = {
          origin: userLocation,
          destination: destination,
          travelMode: travelMode,
        };

        directionsService.route(request, (result, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(result);
          } else {
            console.error('Error fetching directions:', status);
            setError('Failed to fetch route information.');
          }
        });
      }
    }

    // If Google Maps is already available, initialize directly
    if (window.google) {
      initializeMap();
    }
  }, [userLocation, destination, modeOfTravel]);

  return (
    <div className="generatedTrip">
      <Helmet>
        {/* Ensure callback=initMap to trigger once script loads */}
        <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&libraries=places&callback=initMap`}></script>
      </Helmet>
      <div className="tripDetails">
        <h1>Your Generated Trip</h1>
        <div className="description">
          <h2>Description</h2>
          <p>{description}</p>
        </div>
        <div className="activities">
          <h2>Activities</h2>
          <ul>
            {activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>
      </div>
      {modeOfTravel === 'flight' ? (
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
            <p className="error">{error}</p>
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
      ) : (
        <div id="map" className="map"></div>
      )}
      <div className="imageContainer">
        {imagePath ? <img src={imagePath} alt="Generated View" /> : <p>Loading image...</p>}
      </div>
      {audioPath && <audio src={audioPath} autoPlay loop />}
    </div>
  );
};

export default GeneratedTrip;