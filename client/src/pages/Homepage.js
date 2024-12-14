// client/src/pages/Homepage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Homepage.css";

function Homepage() {
    const [location, setLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [randomDestination, setRandomDestination] = useState(false);
    const [modeOfTravel, setModeOfTravel] = useState('car');
    const [interests, setInterests] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (location && (destination || randomDestination)) {
            navigate('/generated-trip', {
                state: {
                    location,
                    destination: randomDestination ? 'RANDOM' : destination,
                    modeOfTravel,
                    interests
                }
            });
        } else {
            alert('Please fill in all required fields.');
        }
    };

    return (
        <div className="homepage">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Your Location:</label>
                    <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <label>Destination:</label>
                    <input 
                        type="text" 
                        value={destination} 
                        onChange={(e) => setDestination(e.target.value)} 
                        disabled={randomDestination}
                        required={!randomDestination}
                    />
                    <label>
                        <input 
                            type="checkbox" 
                            checked={randomDestination} 
                            onChange={(e) => setRandomDestination(e.target.checked)} 
                        />
                        Random Destination
                    </label>
                </div>
                <div className="input-group">
                    <label>Mode of Travel:</label>
                    <select value={modeOfTravel} onChange={(e) => setModeOfTravel(e.target.value)}>
                        <option value="car">Car</option>
                        <option value="train">Train</option>
                        <option value="flight">Flight</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Interests:</label>
                    <textarea 
                        value={interests} 
                        onChange={(e) => setInterests(e.target.value)} 
                        placeholder="e.g., museums, hiking, food tours"
                        required 
                    />
                </div>
                <button type="submit" className="generateTrip">Generate Trip</button>
            </form>
        </div>
    );
}

export default Homepage;