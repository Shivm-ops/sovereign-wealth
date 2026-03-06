import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tickerSymbol: { type: String, required: true },
    assetClass: { type: String, enum: ['Equity', 'Fixed Income', 'Real Estate', 'Commodities', 'Other'], default: 'Equity' },
    totalShares: { type: Number, default: 0 },
    currentPrice: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Asset || mongoose.model('Asset', assetSchema);
