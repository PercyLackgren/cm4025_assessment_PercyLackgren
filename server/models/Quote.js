// models/Quote.js

const mongoose = require('mongoose');

const QuotesSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String,
    },
    timespan_type: {
        type: String,
    },
    timespan: {
        type: Number,
    },
    cost: {
        type: Number,
    },
    fudge: {
        type: Number,
        default: 0.9 + (0.3 * Math.random()), // scale of 0.9 - 1.2
    },
    date: {
        type: Date,
        default: Date.now
    }
});

QuotesSchema.index({ _id: 1, id: 1}, { unique: true });

module.exports = Quote = mongoose.model('Quote', QuotesSchema);