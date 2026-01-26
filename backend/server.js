const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
	  res.json({
		      status: "UP",
		      message: "Backend is running successfully"
		    });
});

app.listen(PORT, () => {
	  console.log(`Backend server running on port ${PORT}`);
});

