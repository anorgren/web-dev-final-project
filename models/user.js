const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    about: {
        type: String,
        trim: true
    },
    salt: String,
    roll: {
        type: Number,
        default: 0,
    },
    history: {
        type: Array,
        default: []
    }
}, { timestamps: true });

userSchema.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashedPassword = this.encryptPassword(password)
    }).get(function() {
        return this._password
});

userSchema.methods = {
    encryptPassword: function(password) {
        if(!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
        } catch (e) {
            return ''
        }
    }
};

module.exports = mongoose.model("User", userSchema);