//server.js
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// Port setup
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB()
  .then(() => {
    console.log('✅ MongoDB connected successfully.');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit the application if DB connection fails
  });

// Create an HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`${signal} signal received: Closing HTTP server and database connection`);
  server.close(async () => {
    console.log('HTTP server closed');
    try {
      await mongoose.connection.close();
      console.log('✅ Database connection closed');
    } catch (err) {
      console.error('❌ Error closing database connection:', err.message);
    }
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
