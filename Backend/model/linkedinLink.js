const mongoose = require('mongoose');

const LinkedinLinkSchema = new mongoose.Schema({
    
    url: {
        type: String,
        required:true,
        unique:true
    },
    interns: { type: mongoose.Schema.Types.ObjectId, ref: 'intern' },
},{timestamps: true});

const linkedinlink = mongoose.model('linkedinlink', LinkedinLinkSchema);
module.exports = linkedinlink;


