import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Define Schemas directly in the server file for simplicity in Serverless environment, 
// or import them if you prefer. For Vercel, compact is often better.

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const portfolioSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    totalValue: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }],
    createdAt: { type: Date, default: Date.now }
});
const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);

const assetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tickerSymbol: { type: String, required: true },
    assetClass: { type: String, enum: ['Equity', 'Fixed Income', 'Real Estate', 'Commodities', 'Other'], default: 'Equity' },
    totalShares: { type: Number, default: 0 },
    currentPrice: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
const Asset = mongoose.models.Asset || mongoose.model('Asset', assetSchema);

const watchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    addedAt: { type: Date, default: Date.now }
});
watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });
const Watchlist = mongoose.models.Watchlist || mongoose.model('Watchlist', watchlistSchema);

const app = express();
app.use(cors());
app.use(express.json());

// Cached connection for Serverless
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    const db = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = db;
    return db;
}

// Routes
app.get('/api/users', async (req, res) => {
    await connectToDatabase();
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/auth/register', async (req, res) => {
    await connectToDatabase();
    try {
        const { email, password, name } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        const newUser = new User({ email, name, password });
        const savedUser = await newUser.save();
        res.status(201).json({ user: savedUser, token: "demo-jwt-token-123" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    await connectToDatabase();
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
        res.status(200).json({ user, token: "demo-jwt-token-123", session: { user } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/watchlist', async (req, res) => {
    await connectToDatabase();
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: 'UserId is required' });
        const items = await Watchlist.find({ userId });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/watchlist', async (req, res) => {
    await connectToDatabase();
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
    await connectToDatabase();
    try {
        const { userId, symbol } = req.query;
        await Watchlist.deleteOne({ userId, symbol });
        res.status(200).json({ message: 'Removed from watchlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default app;
