import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stocks: [{
        stockName: {
            type: String,
            required: true
        },
        stockSymbol: {
            type: String,
            required: true
        },
        sector: {
            type: String,
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

export const Wishlist = mongoose.model('Wishlist', wishlistSchema); 