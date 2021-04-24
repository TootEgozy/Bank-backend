const mongoose = require('mongoose');
const validator = require("../node_modules/validator");
const transactionSchema = mongoose.Schema({
    fromId: {
        type: Array,
        default: [],
        unique: false,
        required: true
    }, 
    toId: {
        type: Array,
        default: [],
        unique: false,
        required: true
    }, 
    date: {
        type: Date,
        required: false,
        default: Date.now(),
        unique: false,
        validate(value) {
            if(!validator.isDate(value))
            throw new Error('Input is not a date. Delete input for auto-inserted date');
        }
    },
    cash: {
        type: Number,
        required: true,
        unique: false,
        min: 0
    },
})

const transactionModel  = mongoose.model('transactions', transactionSchema);
module.exports= transactionModel;