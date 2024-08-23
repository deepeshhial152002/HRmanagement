// hrRoutes.js
const express = require("express");
const router = express.Router();
const hr = require("../model/hr");  
const intern = require("../model/intern");
const link = require("../model/link");
const DeletionLog = require('../model/deletionLog');
const {authenticateToken} = require("../routes/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")



router.post("/sign-up", async (req, res) => {
    try {
        const { Username, password, internID } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newhr = new hr({
            Username,
            password: hash,
            internID,
        });

        await newhr.save();
        res.status(200).json({ message: "Signup successful" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/login",async(req,res)=>{
    try {
        const {Username,password} = req.body;

        const existinguser = await hr.findOne({Username})
        if(!existinguser){
            return res.status(400).json({message:"Invalid credential"})
        }


        bcrypt.compare(password, existinguser.password).then(function(data) {

            if(data){
                const authClaims = [{Username:existinguser.Username}]

                const token = jwt.sign({authClaims},`${process.env.jwtkey}`,{
                    expiresIn:"30d"
                })
                return  res.status(200).json({id:existinguser._id,token:token})
            }
            else{
                return res.status(400).json({message:"Invalid credential"})

            }
        });
       
    } catch (error) {
         res.status(500).json({message:"Internal server error"})
    }
    })


    router.get("/gethrinfo", authenticateToken ,async (req,res)=>{
        try {
            const {id} = req.headers
            const data = await hr.findById(id).select('-password');
            return res.status(200).json(data);
            
        } catch (error) {
            res.status(500).json({message:"Internal server error"})
        }
    })


    router.get("/getall-hr",async (req,res)=>{
        try {
            const allhr =   await hr.find().sort({createdAt:-1})
            return res.status(200).json({
               message:"Sucessfully get all hr",
               data:allhr
            })
        } catch (error) {
            return res.status(500).json({message:"Internal server error"})
        }
    
    })

    router.get("/hrIntern-info", authenticateToken, async (req, res) => {
        try {
            const { id } = req.headers;
    
            // Fetch HR data and populate internID
            const userData = await hr.findById(id).populate("internID");
    
    
            if (!userData) {
                return res.status(404).json({ message: "HR not found" });
            }
    
          
            const interndata = userData.internID;
            res.status(200).json({
                message: "Success to get intern data",
                data: interndata,
            });
    
        } catch (error) {
            console.error("Error fetching HR intern data:", error); // Log the error
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    });
    



    
    router.delete("/delete-intern/:id", authenticateToken, async (req, res) => {
        try {
            const internId = req.params.id;
            const hrId = req.headers.id;
    
            // Fetch the intern details
            const internToDelete = await intern.findById(internId);
            if (!internToDelete) {
                return res.status(404).json({ message: "Intern not found" });
            }
    
            // Fetch the HR details
            const hrData = await hr.findById(hrId);
            if (!hrData) {
                return res.status(404).json({ message: "HR not found" });
            }
    
            // Remove the intern from HR's list
            await hr.findByIdAndUpdate(internToDelete.hrID, {
                $pull: { internID: internId }
            });
    
            // Delete the intern
            await intern.findByIdAndDelete(internId);
    
            // Delete all associated links
            await link.deleteMany({ interns: internId });
    
            // Log the deletion
            const deletionLog = new DeletionLog({
                hrId: hrData._id,
                hrName: hrData.Username, // Save HR name
                internId: internToDelete._id,
                internName: internToDelete.name, // Save intern name
            });
           
            await deletionLog.save();
    
            return res.status(200).json({ message: "Intern and associated links deleted successfully" });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
    
    module.exports = router;
    
    


module.exports = router;  
