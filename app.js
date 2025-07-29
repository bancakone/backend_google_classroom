const express = require("express");
const cors = require("cors");
const authController = require("./controllers/authController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes directes
app.post("/login", authController.login);
app.post("/register", authController.register);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
