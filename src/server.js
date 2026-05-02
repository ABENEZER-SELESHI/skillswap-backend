// src/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");
const userSkillRoutes = require("./routes/userSkillRoutes");
const requestRoutes = require("./routes/requestRoutes");
const matchRoutes = require("./routes/matchRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const { getByMatch } = require("./controllers/sessionController");
const { getByUser } = require("./controllers/requestController");
const { authenticate } = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/users/:id/skills", userSkillRoutes);
app.use("/api/requests", requestRoutes);
app.get("/api/users/:id/requests", authenticate, getByUser);
app.use("/api/matches", matchRoutes);
app.use("/api/sessions", sessionRoutes);
app.get("/api/matches/:id/sessions", authenticate, getByMatch);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
