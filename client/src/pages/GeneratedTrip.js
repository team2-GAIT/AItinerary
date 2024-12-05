import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const GeneratedTrip = () => {
    const location = useLocation();
    const { location: userLocation, budget, modeOfTravel, numTravelers, nationalTravelOnly, typesOfStay } = location.state || {};
    const [itinerary, setItinerary] = useState('');

    useEffect(() => {
        const generatePrompt = (location, budget, modeOfTravel, numTravelers, nationalTravelOnly, typesOfStay) => {
            return `
Generate a travel itinerary based on the following details:
- Location: ${location}
- Budget: ${budget || 'Any'}
- Mode of Travel: ${modeOfTravel || 'Any'}
- Number of Travelers: ${numTravelers || 'Any'}
- National Travel Only: ${nationalTravelOnly ? 'Yes' : 'No'}
- Types of Stay: ${typesOfStay.length > 0 ? typesOfStay.join(', ') : 'Any'}

Please provide a detailed itinerary including places to visit, activities, and accommodation suggestions.
            `;
        };

        const fetchItinerary = async (prompt) => {
            const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your actual API key
            const response = await axios.post(
                'https://api.openai.com/v1/engines/davinci-codex/completions',
                {
                    prompt: prompt,
                    max_tokens: 150,
                    n: 1,
                    stop: null,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );
            return response.data.choices[0].text.trim();
        };

        const prompt = generatePrompt(userLocation, budget, modeOfTravel, numTravelers, nationalTravelOnly, typesOfStay);
        fetchItinerary(prompt).then(setItinerary);
    }, [userLocation, budget, modeOfTravel, numTravelers, nationalTravelOnly, typesOfStay]);

    return (
        <div className="generatedTrip">
            <h1>Your Generated Trip</h1>
            <p>{itinerary}</p>
        </div>
    );
};

export default GeneratedTrip;