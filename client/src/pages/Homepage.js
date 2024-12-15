import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Homepage.css";

function Homepage() {
    const [location, setLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [randomDestination, setRandomDestination] = useState(false);
    const [modeOfTravel, setModeOfTravel] = useState('car');
    const [interests, setInterests] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (location && (destination || randomDestination) && date) {
            setLoading(true);
            const dest = randomDestination ? 'RANDOM' : destination;
            try {
                // Fetch itinerary and airport codes
                const response = await fetch('/api/generate-itinerary', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        travelDetails: {
                            destination: dest,
                            interests,
                        },
                        modeOfTravel,
                        source: location,
                        date
                    }),
                });
                const data = await response.json();

                // Fetch generated image
                const imageResponse = await fetch('/api/generate-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: `A beautiful view of ${dest}` }),
                });
                const imageData = await imageResponse.json();

                // Fetch generated music
                const musicResponse = await fetch('/api/generate-music', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: `Music inspired by ${dest}` }),
                });
                const musicData = await musicResponse.json();

                navigate('/generated-trip', {
                    state: {
                        location,
                        destination: dest,
                        modeOfTravel,
                        interests,
                        sourceAirportCode: data.sourceAirportCode.trim(),
                        destinationAirportCode: data.destinationAirportCode.trim(),
                        description: data.description.trim(),
                        activities: data.activities.map(activity => activity.trim()),
                        date,
                        imagePath: imageData.imagePath,
                        audioPath: musicData.audioPath
                    }
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to generate trip. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please fill in all required fields.');
        }
    };

    return (
        <div className="homepage">
            <form onSubmit={handleSubmit}>
                <button type="submit" className="generateTrip" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Trip'}
                </button>
                <div className="features">
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
                    <div className="input-group">
                        <label>Date (YYYY-MM-DD):</label>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Homepage;
