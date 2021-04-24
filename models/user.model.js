const mongoose = require('mongoose');
const validator = require('../node_modules/validator');

//the mongoose.model & mongoose.schema are like object prototypes.
//when we create a new Model / schema we create an object
//from this prototype.
const userSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
        minLength: 9,
        maxLength: 9,
        validate(value) {
            if(!validator.isNumeric(value, {no_symboles: true})) {
                throw new Error ('Invalid id')
            }
        }

    },    
    name: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        lowecase: true,
        validate(value) {
            if(!value.length > 5)
            throw new Error('Must enter full name');        }
    },
    phoneNumber: {
        type: String,
        required: false,
        unique: true,
        nimLength: 10,
        maxLength: 10
    },
    email: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error ('Invalid email');
            }
        }
    },
    isActive: {
        type: Boolean,
        default: true,
        required: false
    }, 
    accounts: {
        type: Array,
        default: [],
        required: false,
        dropDups: true
        
    }
})

const userModel  = mongoose.model('Users',userSchema);
module.exports= userModel;