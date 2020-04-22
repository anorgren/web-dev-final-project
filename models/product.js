const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);