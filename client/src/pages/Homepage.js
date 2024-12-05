import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Homepage.css";

function Homepage(props) {
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState('');
    const [modeOfTravel, setModeOfTravel] = useState('');
    const [numTravelers, setNumTravelers] = useState('');
    const [nationalTravelOnly, setNationalTravelOnly] = useState(false);
    const [typesOfStay, setTypesOfStay] = useState([]);
    const navigate = useNavigate();

    const handleTypesOfStayChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setTypesOfStay([...typesOfStay, value]);
        } else {
            setTypesOfStay(typesOfStay.filter((type) => type !== value));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (location) {
            navigate('/generated-trip', {
                state: {
                    location,
                    budget,
                    modeOfTravel,
                    numTravelers,
                    nationalTravelOnly,
                    typesOfStay
                }
            });
        } else {
            alert('Please enter your location.');
        }
    };

    return (
        <div className="homepage">
            <form onSubmit={handleSubmit}>
                <button type="submit" className="generateTrip">Generate Trip</button>
                <div className="features">
                    <div className="userLocation">
                        <label>Your Location: </label>
                        <input 
                            type="text" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="budget">
                        <label>Budget: </label>
                        <input 
                            type="number" 
                            value={budget} 
                            onChange={(e) => setBudget(e.target.value)} 
                        />
                    </div>
                    <div className="modeOfTravel">
                        <label>Mode of Travel: </label>
                        <select value={modeOfTravel} onChange={(e) => setModeOfTravel(e.target.value)}>
                            <option value="">Select Mode of Travel</option>
                            <option value="car">Car</option>
                            <option value="flight">Flight</option>
                            <option value="bus">Bus</option>
                            <option value="rideshare">Rideshare</option>
                        </select>
                    </div>
                    <div className="numTravelers">
                        <label>Number of Travelers: </label>
                        <input 
                            type="number" 
                            value={numTravelers} 
                            onChange={(e) => setNumTravelers(e.target.value)} 
                        />
                    </div>
                    <div className="nationalTravelOnly">
                        <label>
                            <input 
                                type="checkbox" 
                                checked={nationalTravelOnly} 
                                onChange={(e) => setNationalTravelOnly(e.target.checked)} 
                            />
                            National Travel Only
                        </label>
                    </div>
                    <div className="typesOfStay">
                        <label>Types of Stay: </label>
                        <div>
                            <label>
                                <input 
                                    type="checkbox" 
                                    value="hotel" 
                                    checked={typesOfStay.includes('hotel')} 
                                    onChange={handleTypesOfStayChange} 
                                />
                                Hotel
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    value="hostel" 
                                    checked={typesOfStay.includes('hostel')} 
                                    onChange={handleTypesOfStayChange} 
                                />
                                Hostel
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    value="bnb" 
                                    checked={typesOfStay.includes('bnb')} 
                                    onChange={handleTypesOfStayChange} 
                                />
                                Bed & Breakfast
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    value="camping" 
                                    checked={typesOfStay.includes('camping')} 
                                    onChange={handleTypesOfStayChange} 
                                />
                                Camping
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Homepage;