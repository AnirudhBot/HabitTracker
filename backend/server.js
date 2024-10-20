const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const habitRoutes = require("./routes/habitRoutes");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "https://habit-tracker-three-nu.vercel.app",
    credentials: true,
  })
);

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
