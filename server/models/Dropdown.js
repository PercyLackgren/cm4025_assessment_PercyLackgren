// models/dropdown.js

const mongoose = require('mongoose');

const DropdownSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    value: {
        type: Number,
    },
    field: {
        type: String,
    }
});

module.exports = Dropdown = mongoose.model('Dropdown', DropdownSchema);