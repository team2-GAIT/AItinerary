const express = require("express");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors()); // Enable cross-origin requests

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // Replace with your actual API key
const RAPIDAPI_HOST = "sky-scanner3.p.rapidapi.com";

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

