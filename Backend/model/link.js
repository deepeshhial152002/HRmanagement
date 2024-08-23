const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    
    url: {
        type: String,
        required:true,
        unique:true
    },
    interns: { type: mongoose.Schema.Types.ObjectId, ref: 'intern' },
},{timestamps: true});

const link = mongoose.model('link', linkSchema);
module.exports = link;
