const express = require("express");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// OpenAI endpoint using Chat Completions API
app.post("/api/generate-itinerary", async (req, res) => {
  const { travelDetails, modeOfTravel, source } = req.body;
  const { destination, interests } = travelDetails;

  if (!destination || !interests || !source) {
    return res.status(400).json({ error: "Missing source, destination, or interests." });
  }

  try {
    const prompt = `
You are a helpful travel assistant.

You will receive a source location, a destination, and a set of interests. 
You must always return the response in the following format:

1) The 3-letter airport code of the source location, followed immediately by:
2) A delimiter line containing only "###"
3) The 3-letter airport code of the destination location, followed immediately by:
4) A delimiter line containing only "###"
5) A 3-5 sentence description of the destination, followed immediately by:
6) A delimiter line containing only "###"
7) Five unique activities based on the provided interests (1-2 sentences), each separated by a line containing only "###"

Formatting requirements:
- The airport codes should be on separate lines, each followed by a delimiter line containing only "###"
- The destination description should be a single line, not mentioning the interests again.
- After the description, print a line containing only "###"
- Then print exactly five activities, each separated by a line containing only "###"

For example, if the source is New York, the destination is Paris, and the interests include museums and fine dining, the response should look like this (note: this is just an example):

JFK
###
CDG
###
A romantic city known for its art, culture, and culinary delights. With a vibrant night life and some amazing tourist attractions.
###
Explore the Louvre Museum’s vast art collection
###
Enjoy a gourmet dinner at a Michelin-starred restaurant
###
Visit the Musée d'Orsay for Impressionist masterpieces
###
Take a walking tour of the historic Montmartre neighborhood
###
Relax at a charming sidewalk café near the Eiffel Tower

Do not include extra text, disclaimers, or the interests/destination in the activities beyond the initial description. Follow this exact formatting every time.
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful travel assistant." },
          { role: "user", content: `Source: ${source}, Destination: ${destination}, Interests: ${interests}` },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the assistant's reply
    const result = response.data.choices[0].message.content.trim();
    const parts = result.split('###').map(part => part.trim());

    if (parts.length !== 8) {
      throw new Error('Unexpected response format');
    }

    const [sourceAirportCode, destinationAirportCode, description, ...activities] = parts;

    res.json({ sourceAirportCode, destinationAirportCode, description, activities });
  } catch (error) {
    console.error('Error fetching from OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate itinerary.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});