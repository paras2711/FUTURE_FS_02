const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser

// Route mappings
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running healthy' });
});

// Error handling middleware for uncaught errors
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
