const mongoose = require('mongoose');

const deletionLogSchema = new mongoose.Schema({
    hrId: { type: mongoose.Schema.Types.ObjectId, ref: 'HR', required: true },
    hrName: { type: String, required: true }, // Store HR name
    internId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
    internName: { type: String, required: true }, // Store intern name
    timestamp: { type: Date, default: Date.now }
},{timestamps: true});

module.exports = mongoose.model('DeletionLog', deletionLogSchema);
