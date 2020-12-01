const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const QuoteSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Quote = mongoose.model('quotes', QuoteSchema);
