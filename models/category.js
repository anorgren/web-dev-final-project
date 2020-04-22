const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    // TODO: Make unique index
    name: {
        type: String,
        trim: true,
        required: true
    },
}, { timestamps: true });


module.exports = mongoose.model("Category", categorySchema);