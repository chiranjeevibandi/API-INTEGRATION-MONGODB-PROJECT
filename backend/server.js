// // CommonJS to avoid ESM config headaches
// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion } = require("mongodb");
// require("dotenv").config();

// const app = express();
// app.use(cors()); // allow all origins in dev; tighten later if needed
// app.use(express.json());

// // --- MongoDB connection ---
// const client = new MongoClient(process.env.MONGO_URI, {
//   serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
// });

// let collection;

// async function init() {
//   try {
//     await client.connect();
//     const db = client.db(process.env.DB_NAME || "weatherDB");
//     collection = db.collection(process.env.COLLECTION || "forecasts");
//     console.log("✅ Connected to MongoDB and ready.");
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err.message);
//     process.exit(1);
//   }
// }
// init();

// // --- Routes ---
// app.get("/health", (req, res) => res.json({ status: "ok" }));

// // Save the weather currently shown on the UI
// app.post("/save-weather", async (req, res) => {
//   try {
//     const { city, weather } = req.body;
//     if (!city || !weather) {
//       return res.status(400).json({ error: "city and weather are required" });
//     }

//     const doc = {
//       city,
//       tempC: weather?.main?.temp,
//       feelsLikeC: weather?.main?.feels_like,
//       humidity: weather?.main?.humidity,
//       description: weather?.weather?.[0]?.description,
//       icon: weather?.weather?.[0]?.icon,
//       wind: weather?.wind,
//       coord: weather?.coord,
//       raw: weather,           // full OpenWeather payload for reference
//       savedAt: new Date()
//     };

//     const result = await collection.insertOne(doc);
//     res.json({ ok: true, id: result.insertedId });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "db_insert_failed" });
//   }
// });

// // Optional: quick viewer to check saved docs
// app.get("/get-weather", async (req, res) => {
//   try {
//     const allData = await collection.find().sort({ savedAt: -1 }).toArray(); // ✅ use savedAt
//     res.send(allData);
//   } catch (err) {
//     res.status(500).send({ success: false, error: err.message });
//   }
// });

// const PORT = process.env.PORT || 5555;
// app.listen(PORT, () => console.log(`🚀 Backend listening on http://localhost:${PORT}`));
// server.js
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

let collection;

async function init() {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || "weatherDB");
    collection = db.collection(process.env.COLLECTION || "forecasts");
    console.log("✅ Connected to MongoDB and ready.");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
init();

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Save weather
app.post("/save-weather", async (req, res) => {
  try {
    const { city, weather } = req.body;
    if (!city || !weather) {
      return res.status(400).json({ error: "city and weather are required" });
    }

    const doc = {
      city,
      tempC: weather?.main?.temp,
      feelsLikeC: weather?.main?.feels_like,
      humidity: weather?.main?.humidity,
      description: weather?.weather?.[0]?.description,
      icon: weather?.weather?.[0]?.icon,
      wind: weather?.wind,
      coord: weather?.coord,
      raw: weather,
      savedAt: new Date()
    };

    const result = await collection.insertOne(doc);
    res.json({ ok: true, id: result.insertedId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db_insert_failed" });
  }
});

// Fetch saved weather
app.get("/get-weather", async (req, res) => {
  try {
    const allData = await collection.find().sort({ savedAt: -1 }).toArray();
    res.json(allData);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => console.log(`🚀 Backend listening on http://localhost:${PORT}`));
