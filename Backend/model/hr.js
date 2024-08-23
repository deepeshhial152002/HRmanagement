const mongoose = require("mongoose");
const HrSchema = new mongoose.Schema({
    Username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    internID:[{       
        type: mongoose.Schema.Types.ObjectId,
        ref:"intern"      
    }],

},{timestamps: true})


const hr =mongoose.model("hr",HrSchema)
module.exports = hr