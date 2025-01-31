//app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorMiddleware');
require('dotenv').config();

// Importing routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
// const attendanceRoutes = require('./routes/attendanceRoutes');
// const meetingRoutes = require('./routes/meetingRoutes');
// const leaderboardRoutes = require('./routes/leaderboardRoutes');
// const batchRoutes = require('./routes/batchRoutes');
// const missionRoutes = require('./routes/missionRoutes');
// const taskRoutes = require('./routes/taskRoutes');
// const fileRoutes = require('./routes/fileRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const userRoutes = require('./routes/userRoutes');
// const progressRoutes = require('./routes/progressRoutes');
const adminRoutes = require('./routes/adminRoutes');  // Import admin routes
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// CORS Configuration (Allow all origins and methods)
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allow all methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
};

app.use(cors(corsOptions)); // Enable CORS with specific configuration

// Middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Logging for request details
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
// app.use('/api/attendance', attendanceRoutes);
// app.use('/api/meetings', meetingRoutes);
// app.use('/api/leaderboard', leaderboardRoutes);
// app.use('/api/batch', batchRoutes);
// app.use('/api/missions', missionRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/files', fileRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);  // Add the admin routes

// Health Check Route (can be used to verify server status)
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Error handling middleware (to handle custom errors globally)
app.use(errorMiddleware); // This should be defined in your middleware

module.exports = app;
