import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileRoutes from './routes/fileRoutes.js';

// 1. Load secret environment variables (like our cloud keys)
dotenv.config();

// 2. Initialize the Express application
const app = express();

// 3. Middleware setup
// CORS allows our React frontend (which will run on a different port) to securely talk to this server
app.use(cors());
// This allows our server to read JSON data sent from the frontend
// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 4. A basic "Health Check" route
// When someone visits the root URL ('/'), send back a simple message
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
    res.send("Mini Drive API is running!");
});

// Tell Express to use our new routes for any request that starts with /api/files


// 5. Define the port our server will run on (default to 5000)
const PORT = process.env.PORT || 5000;

// 6. Start the server and listen for connections
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});