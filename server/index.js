// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();


// create endpoint for the route /api
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


