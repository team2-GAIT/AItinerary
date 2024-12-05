import React from 'react';
import { useLocation } from 'react-router-dom';

const GeneratedTrip = () => {
    const location = useLocation();
    const { location: userLocation, budget, modeOfTravel, numTravelers, nationalTravelOnly, typesOfStay } = location.state || {};

    const generateRandomContent = (field, defaultValue) => {
        const randomValues = {
            location: ['Paris', 'New York', 'Tokyo', 'Sydney'],
            budget: ['low', 'medium', 'high'],
            modeOfTravel: ['car', 'flight', 'bus', 'rideshare'],
            numTravelers: [1, 2, 3, 4, 5],
            typesOfStay: ['hotel', 'hostel', 'bnb', 'camping']
        };
        return field || randomValues[defaultValue][Math.floor(Math.random() * randomValues[defaultValue].length)];
    };

    return (
        <div className="generatedTrip">
            <h1>Your Generated Trip</h1>
            <p>
                You will be traveling from {generateRandomContent(userLocation, 'location')} with a {generateRandomContent(budget, 'budget')} budget.
                You will be traveling by {generateRandomContent(modeOfTravel, 'modeOfTravel')} with {generateRandomContent(numTravelers, 'numTravelers')} travelers.
                Your stay will be at a {generateRandomContent(typesOfStay.join(', '), 'typesOfStay')}.
                {nationalTravelOnly ? ' This trip is limited to national travel only.' : ''}
            </p>
        </div>
    );
};

export default GeneratedTrip