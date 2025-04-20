require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const path = require("path");

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



console.log("Frontend URL:", process.env.FRONTEND_URL);

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Handle Preflight Requests
app.options("*", cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/", require("./routes/membershipRoutes"));
app.use("/api/", require("./routes/scheduleRoutes"));
app.use("/api/", require("./routes/trainerRoutes"));
app.use("/api/", require("./routes/userRoutes"));
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
