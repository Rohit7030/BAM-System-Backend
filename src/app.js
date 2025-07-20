const express = require('express');
const cors = require('cors'); // Import cors


const authRoutes = require('./routes/auth');
const bankAccountRoutes = require('./routes/bankAccounts');
const adminRoutes = require('./routes/admin'); 

const app = express();

// Middleware
app.use(express.json()); 

const cors = require('cors');

const allowedOrigins = [
    'http://localhost:5173', // For local frontend development
    'https://your-frontend-app.netlify.app' // Replace with your actual deployed Netlify frontend URL
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent with requests
    optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 200
};

app.use(cors(corsOptions)); // Use the configured CORS options

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);
app.use('/api/admin', adminRoutes); // Admin routes will be prefixed with /api/admin

// Basic route for testing (optional)
app.get('/', (req, res) => {
  res.send('Bank Information Management System API is running!');
});

// Global Error Handler (optional but good practice)
// You can define a more sophisticated error handler in src/utils/errorHandler.js later
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;