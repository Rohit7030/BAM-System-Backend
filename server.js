const app = require('./src/app'); // Import the Express app from app.js
const connectDB = require('./src/config/db'); // Import the database connection function
require('dotenv').config(); // Load environment variables

// Connect to database
connectDB();

// Define port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
});