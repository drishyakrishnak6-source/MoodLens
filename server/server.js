const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Connect Database
require("./database/initDB");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 MoodLens Backend is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});