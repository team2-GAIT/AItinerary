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
                        date
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
                    {loading ? (
                        <svg className="pl" viewBox="0 0 160 160" width="160px" height="160px" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#000"></stop>
                                    <stop offset="100%" stop-color="#fff"></stop>
                                </linearGradient>
                                <mask id="mask1">
                                    <rect x="0" y="0" width="160" height="160" fill="url(#grad)"></rect>
                                </mask>
                                <mask id="mask2">
                                    <rect x="28" y="28" width="104" height="104" fill="url(#grad)"></rect>
                                </mask>
                            </defs>
                            <g>
                                <g className="pl__ring-rotate">
                                    <circle className="pl__ring-stroke" cx="80" cy="80" r="72" fill="none" stroke="hsl(223,90%,55%)" stroke-width="16" stroke-dasharray="452.39 452.39" stroke-dashoffset="452" stroke-linecap="round" transform="rotate(-45,80,80)"></circle>
                                </g>
                            </g>
                            <g mask="url(#mask1)">
                                <g className="pl__ring-rotate">
                                    <circle className="pl__ring-stroke" cx="80" cy="80" r="72" fill="none" stroke="hsl(193,90%,55%)" stroke-width="16" stroke-dasharray="452.39 452.39" stroke-dashoffset="452" stroke-linecap="round" transform="rotate(-45,80,80)"></circle>
                                </g>
                            </g>
                            <g>
                                <g stroke-width="4" stroke-dasharray="12 12" stroke-dashoffset="12" stroke-linecap="round" transform="translate(80,80)">
                                    <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(-135,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(-90,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(-45,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(0,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(45,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(90,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(135,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,10%,90%)" points="0,2 0,14" transform="rotate(180,0,0) translate(0,40)"></polyline>
                                </g>
                            </g>
                            <g mask="url(#mask1)">
                                <g stroke-width="4" stroke-dasharray="12 12" stroke-dashoffset="12" stroke-linecap="round" transform="translate(80,80)">
                                    <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(-135,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(-90,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(-45,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(0,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(45,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(90,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(135,0,0) translate(0,40)"></polyline>
                                    <polyline className="pl__tick" stroke="hsl(223,90%,80%)" points="0,2 0,14" transform="rotate(180,0,0) translate(0,40)"></polyline>
                                </g>
                            </g>
                            <g>
                                <g transform="translate(64,28)">
                                    <g className="pl__arrows" transform="rotate(45,16,52)">
                                        <path fill="hsl(3,90%,55%)" d="M17.998,1.506l13.892,43.594c.455,1.426-.56,2.899-1.998,2.899H2.108c-1.437,0-2.452-1.473-1.998-2.899L14.002,1.506c.64-2.008,3.356-2.008,3.996,0Z"></path>
                                        <path fill="hsl(223,10%,90%)" d="M14.009,102.499L.109,58.889c-.453-1.421,.559-2.889,1.991-2.889H29.899c1.433,0,2.444,1.468,1.991,2.889l-13.899,43.61c-.638,2.001-3.345,2.001-3.983,0Z"></path>
                                    </g>
                                </g>
                            </g>
                            <g mask="url(#mask2)">
                                <g transform="translate(64,28)">
                                    <g className="pl__arrows" transform="rotate(45,16,52)">
                                        <path fill="hsl(333,90%,55%)" d="M17.998,1.506l13.892,43.594c.455,1.426-.56,2.899-1.998,2.899H2.108c-1.437,0-2.452-1.473-1.998-2.899L14.002,1.506c.64-2.008,3.356-2.008,3.996,0Z"></path>
                                        <path fill="hsl(223,90%,80%)" d="M14.009,102.499L.109,58.889c-.453-1.421,.559-2.889,1.991-2.889H29.899c1.433,0,2.444,1.468,1.991,2.889l-13.899,43.61c-.638,2.001-3.345,2.001-3.983,0Z"></path>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    ) : (
                        'Generate Trip'
                    )}
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