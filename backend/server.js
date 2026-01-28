const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB URL from env
const MONGO_URL =
  process.env.MONGO_URL || "mongodb://mongodb-service:27017/three-tier-db";

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api/health", (req, res) => {
  res.json({
    status: "UP",
    message: "Backend is running successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
