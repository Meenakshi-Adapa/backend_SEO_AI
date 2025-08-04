import dotenv from 'dotenv';
dotenv.config();

// --- DEBUGGING STEP ---
// This line will run when the server starts.
console.log("Checking for API Key...");
console.log(`Is the OpenAI Key loaded? ${process.env.OPENAI_API_KEY ? 'Yes, it is!' : 'No, it is MISSING.'}`);
// --------------------

import express from 'express';
import mongoose from 'mongoose';
import analyzeRoutes from './routes/analyzeRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', analyzeRoutes); // Changed to /api for clarity

// Root route
app.get('/', (req, res) => {
  res.send('SEO AI Backend is running');
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB Atlas');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});