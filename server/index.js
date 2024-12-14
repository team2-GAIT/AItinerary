const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const MUSIC_API_KEY = process.env.MUSIC_API_KEY;
const RAPIDAPI_HOST = "sky-scanner3.p.rapidapi.com";

// Serve the public directory
app.use(express.static(path.join(__dirname, "public")));

// Ensure the public directory exists
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Endpoint to generate image
app.post("/api/generate-image", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const imageUrl = response.data.data[0].url;

    // Download the image
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imagePath = path.join(publicDir, "generated_image.png");
    fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));

    res.json({ imagePath: "/generated_image.png" });
  } catch (error) {
    console.error("Error generating image:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate image.' });
  }
});

// Endpoint to generate music
app.post("/api/generate-music", async (req, res) => {
  const { prompt, duration = 30 } = req.body; // Set default duration to 30 seconds
  try {
    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: "7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906",
        input: { prompt: prompt, duration: duration },
      },
      {
        headers: {
          Authorization: `Token ${MUSIC_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const prediction = response.data;
    let status = prediction.status;
    while (status !== "succeeded" && status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const pollResponse = await axios.get(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: { Authorization: `Token ${MUSIC_API_KEY}` },
        }
      );
      status = pollResponse.data.status;
      if (status === "succeeded") {
        const audioUrl = pollResponse.data.output[0];

        // Validate the audio URL
        if (!audioUrl || !audioUrl.startsWith("http")) {
          console.error("Invalid URL received:", audioUrl);
          res.status(500).json({ error: 'Invalid URL received for music.' });
          return;
        }

        // Download the audio file
        const audioResponse = await axios.get(audioUrl, { responseType: "arraybuffer" });
        const audioPath = path.join(publicDir, "generated_music.wav");
        fs.writeFileSync(audioPath, Buffer.from(audioResponse.data));

        res.json({ audioPath: "/generated_music.wav" });
        return;
      }
    }

    if (status === "failed") {
      res.status(500).json({ error: 'Music generation failed.' });
    }
  } catch (error) {
    console.error("Error generating music:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate music.' });
  }
});

// Existing OpenAI endpoint
app.post("/api/generate-itinerary", async (req, res) => {
  const { travelDetails, modeOfTravel, source, date } = req.body;
  const { destination, interests } = travelDetails;

  if (!destination || !interests || !source || !date) {
    return res.status(400).json({ error: "Missing source, destination, interests, or date." });
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

    const openAIResponse = await axios.post(
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
    const result = openAIResponse.data.choices[0].message.content.trim();
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

app.get("/api/flights", async (req, res) => {
  const { source, destination, date } = req.query;

  if (!source || !destination || !date) {
    return res.status(400).json({ error: "Missing required query parameters." });
  }

  try {
    const response = await axios.get(
      `https://${RAPIDAPI_HOST}/flights/search-one-way`,
      {
        params: {
          fromEntityId: source,
          toEntityId: destination,
          departDate: date,
        },
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      }
    );
    res.json(response.data.data);
  } catch (error) {
    console.error("Error fetching data from Skyscanner API:", error);
    res.status(500).json({ error: "Failed to fetch data from API." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});