// Require necessary modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Define the MongoDB connection URL
const mongoURL = process.env.MONGOOSE_URL_LOCAL;

// Set up MongoDB connection
mongoose.connect(mongoURL);

// Get the default Mongoose connection
const db = mongoose.connection;

// Event listeners for Mongoose connection events
db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});



// Export the Mongoose connection instance
module.exports = db;
