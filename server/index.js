const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const authRoutes = require("./routes/auth");
const inspirationRoutes = require("./routes/inspirations");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Routes
app.use("/api", authRoutes);
app.use("/api", inspirationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// MongoDB connection events
mongoose.connection.on("connecting", () => {
  console.log("Connecting to MongoDB...");
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB Atlas successfully");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// MongoDB connection
console.log("Attempting to connect to MongoDB...");
console.log("Using URI:", process.env.MONGODB_URI ? "Atlas URI" : "Local URI");
console.log(
  "URI starts with:",
  process.env.MONGODB_URI
    ? process.env.MONGODB_URI.substring(0, 20) + "..."
    : "No URI"
);

mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/inspiration_gallery"
  )
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas successfully!");
    console.log("📊 Database:", mongoose.connection.db.databaseName);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("🔍 Error details:");
    console.error("  - Error name:", error.name);
    console.error("  - Error code:", error.code);
    if (error.reason && error.reason.servers) {
      console.error(
        "  - Attempted servers:",
        Array.from(error.reason.servers.keys())
      );
    }

    // Additional troubleshooting info
    if (error.message.includes("IP") || error.message.includes("whitelist")) {
      console.error("💡 IP Whitelist issue detected!");
      console.error("   Please verify in MongoDB Atlas:");
      console.error("   1. Go to Network Access");
      console.error("   2. Check if your IP is listed and ACTIVE");
      console.error("   3. Or temporarily add 0.0.0.0/0 for testing");
    }
    if (error.message.includes("authentication")) {
      console.error("💡 Authentication issue detected!");
      console.error("   Please check username/password in connection string");
    }

    // Don't exit, let nodemon restart
    console.error("   Server will restart in 5 seconds...");
  });
