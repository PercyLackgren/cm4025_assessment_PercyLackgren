// models/Quote.js

const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true
    },
    sub_id: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
        cost_type: {
        type: String
    },
        cost: {
        type: Number
    }
});

module.exports = Quote = mongoose.model('quote', QuoteSchema);