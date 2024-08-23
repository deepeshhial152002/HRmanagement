const express = require('express');
const router = express.Router();
const DeletionLog = require('../model/deletionLog');

router.get("/getall-deletedlogs",async (req,res)=>{
    try {
        const allhr =   await DeletionLog.find().sort({createdAt:-1})
        return res.status(200).json({
           message:"Sucessfully get all deleted logs",
           data:allhr
        })
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }

})

module.exports = router;