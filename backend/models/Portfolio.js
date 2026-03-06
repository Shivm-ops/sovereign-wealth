import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    totalValue: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);
