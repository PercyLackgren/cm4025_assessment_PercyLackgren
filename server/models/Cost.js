// models/Cost.js

const mongoose = require('mongoose');

const CostsSchema = new mongoose.Schema({
    quote: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Quote",
        required: true
    },
    sub_id: {
        type: Number,
        required: true,
        default: 0
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    preset_rate: {
        type: String,
    },
    cost_type: {
        type: String
    },
    cost: {
        type: Number
    }
});

module.exports = Cost = mongoose.model('Cost', CostsSchema);