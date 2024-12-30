const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const loanRoutes = require('./routes/loanRoutes');


// Initialize dotenv for environment variables
dotenv.config();

// Create the express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running');
});

// Customer Routes
app.use('/c', customerRoutes);

// Loan routes
app.use('/l', loanRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
