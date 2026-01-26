const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// MongoDB connection (container name, not localhost)
// const MONGO_URL = "mongodb://mongodb-container:27017/testdb";
//
// app.use(cors());
// app.use(express.json());
//
// // Connect to MongoDB
// mongoose
//   .connect(MONGO_URL)
//     .then(() => console.log("MongoDB connected successfully"))
//       .catch((err) => console.error("MongoDB connection error:", err));
//
//       app.get("/api/health", (req, res) => {
//         res.json({
//             status: "UP",
//                 message: "Backend is running and connected to MongoDB",
//                   });
//                   });
//
//                   app.listen(PORT, () => {
//                     console.log(`Backend server running on port ${PORT}`);
//                     });
