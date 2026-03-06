import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import Portfolio from './models/Portfolio.js';
import Asset from './models/Asset.js';
import Watchlist from './models/Watchlist.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, 'users.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB is connected successfully. Restarted.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Sovereign Wealth API is running');
});

// Example API Routes

// 1. Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Add a user
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. Get portfolios
app.get('/api/portfolios', async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate('assets');
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Simplistic text password saved for now (add bcrypt for real production apps)
    const newUser = new User({ email, name, password });
    const savedUser = await newUser.save();

    // --- NEW LOGIC: Save user data directly to a local file ---
    let localUsers = [];
    if (fs.existsSync(usersFilePath)) {
      const fileData = fs.readFileSync(usersFilePath, 'utf8');
      if (fileData) localUsers = JSON.parse(fileData);
    }
    // Append the new user to our local array
    localUsers.push({
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      createdAt: savedUser.createdAt
    });
    // Write it back to users.json on your computer
    fs.writeFileSync(usersFilePath, JSON.stringify(localUsers, null, 2));

    // Simulate token
    res.status(201).json({ user: savedUser, token: "demo-jwt-token-123" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Simplistic check
    res.status(200).json({ user, token: "demo-jwt-token-123", session: { user } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Watchlist Routes ---
app.get('/api/watchlist', async (req, res) => {
  try {
    const { userId } = req.query; // For now simplified, later use JWT auth
    if (!userId) return res.status(400).json({ message: 'UserId is required' });
    const items = await Watchlist.find({ userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/watchlist', async (req, res) => {
  try {
    const { userId, symbol, name } = req.body;
    const newItem = new Watchlist({ userId, symbol, name });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/watchlist', async (req, res) => {
  try {
    const { userId, symbol } = req.query;
    await Watchlist.deleteOne({ userId, symbol });
    res.status(200).json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
