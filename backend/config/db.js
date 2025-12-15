const mongoose = require("mongoose");

// Helper function to connect to our MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect using the URI from our .env file
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    // If connection fails, log the error and stop the server (exit code 1)
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
