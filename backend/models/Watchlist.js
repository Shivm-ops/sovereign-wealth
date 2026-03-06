import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    addedAt: { type: Date, default: Date.now }
});

// Compound unique index: A user can't have the same symbol twice in their watchlist
watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default mongoose.models.Watchlist || mongoose.model('Watchlist', watchlistSchema);
