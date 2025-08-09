import chalk from "chalk";
import cors from "cors";
import express from "express";
import path from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// API endpoint for image search
app.get("/api/search-images", async (req, res) => {
  try {
    const { query, page } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const API_KEY = process.env.UNSPLASH_API_KEY;
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&page=${page || 1}&client_id=${API_KEY}`;

    console.log("Making request to:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Unsplash API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`Found ${data.results.length} images`);
    res.json(data);
  } catch (error) {
    console.error("Error fetching images:", error.message);
    res.status(500).json({ error: "Failed to fetch images: " + error.message });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(chalk.cyan(`🚀 Server running on http://localhost:${PORT}`));
  console.log(
    chalk.yellow(`📱 Open your browser and go to: http://localhost:${PORT}`)
  );
});
