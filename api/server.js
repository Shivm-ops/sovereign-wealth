import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

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

const watchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    addedAt: { type: Date, default: Date.now }
});
watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });
const Watchlist = mongoose.models.Watchlist || mongoose.model('Watchlist', watchlistSchema);

const app = express();

// CORS - allow all origins for serverless
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Cached connection for Serverless (avoids reconnecting on every request)
let cachedConnection = null;

async function connectToDatabase() {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
    }
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    });
    return cachedConnection;
}

// Health check
app.get('/api', (req, res) => {
    res.json({ status: 'Sovereign Wealth API is running on Vercel ✅' });
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        await connectToDatabase();
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        await connectToDatabase();
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        const newUser = new User({ email, name, password });
        const savedUser = await newUser.save();
        res.status(201).json({
            user: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
            token: "demo-jwt-token-123"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        await connectToDatabase();
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
        // Simple password check (no bcrypt for now)
        if (user.password && user.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const userObj = { id: user._id, name: user.name, email: user.email };
        res.status(200).json({ user: userObj, token: "demo-jwt-token-123", session: { user: userObj } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get watchlist
app.get('/api/watchlist', async (req, res) => {
    try {
        await connectToDatabase();
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: 'UserId is required' });
        const items = await Watchlist.find({ userId });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add to watchlist
app.post('/api/watchlist', async (req, res) => {
    try {
        await connectToDatabase();
        const { userId, symbol, name } = req.body;
        const newItem = new Watchlist({ userId, symbol, name });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove from watchlist
app.delete('/api/watchlist', async (req, res) => {
    try {
        await connectToDatabase();
        const { userId, symbol } = req.query;
        await Watchlist.deleteOne({ userId, symbol });
        res.status(200).json({ message: 'Removed from watchlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default app;
