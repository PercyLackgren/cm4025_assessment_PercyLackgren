// models/Quote.js

const mongoose = require('mongoose');

const QuotesSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

QuotesSchema.index({ _id: 1, id: 1}, { unique: true });

module.exports = Quote = mongoose.model('quote', QuotesSchema);