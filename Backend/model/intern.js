const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
name:{
        type:String,
        required:true,
        
   },

DOB:{
    type:String,
    required:true,
},
hrID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'hr' 
},

links: [{
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'link' 
}],
createdAt: {
    type: Date,
    default: Date.now
}
},{timestamps: true});

const intern = mongoose.model('intern', internSchema);
module.exports = intern;



