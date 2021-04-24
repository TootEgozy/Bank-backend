const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const validator = require('../node_modules/validator');

//I need to find a way to validate that a user with this id exist in the database.
const accountSchema = mongoose.Schema({
    ownerIdMongo: {
        type: Array,
        default: [],
        unique: false
    }, 
    transActions: {
        type: Array,
        default: [],
        unique: false
    },
    credit: {
        type: Number,
        required: false,
        default: 0,
        unique: false,
        trim: true,
        min: 0,
    },
    cash: {
        type: Number,
        required: false,
        unique: false,
        default: 0,
        validate(value) {
            if(value < 0) {
                if((value * -1) > this.credit) {
                    throw new Error ('Illegal: debt cannot exceed credit');
                }
            }
        }
    },
    isActive: {
        type: Boolean,
        default: true,
        required: false
    }
})

const accountModel  = mongoose.model('Accounts', accountSchema);
module.exports= accountModel;