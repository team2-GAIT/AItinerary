// server/index.js
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

  if (!destination || !interests) {
    return res.status(400).json({ error: "Missing destination or interests." });
  }

  try {
    const prompt = `
You are a helpful travel assistant.

You will receive a destination and a set of interests. 
You must always return the response in the following format:

1) A 3-5 sentance description of the destination, followed immediately by:
2) A delimiter line containing only "###"
3) Five unique activities based on the provided interests (1-2 sentances), each separated by a line containing only "###"

Formatting requirements:
- The destination description should be a single line, not mentioning the interests again.
- After the description, print a line containing only "###"
- Then print exactly five activities, each separated by a line containing only "###"

For example, if the destination is Paris and the interests include museums and fine dining, the response should look like this (note: this is just an example):

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
          { role: "user", content: `Destination: ${destination}, Interests: ${interests}` },
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
    const itinerary = response.data.choices[0].message.content.trim();

    res.json({ itinerary });
  } catch (error) {
    console.error('Error fetching from OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate itinerary.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});