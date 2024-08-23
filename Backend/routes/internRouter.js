const express = require("express");
const router = express.Router();
const hr = require("../model/hr");
const intern = require("../model/intern");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {authenticateToken} = require("../routes/auth");

router.post("/sign-up-intern", async (req, res) => {
    try {
        const { name,  DOB, hrID } = req.body;

        // Check username length
        if (name.length < 4) {
            return res.status(400).json({ message: "Username length must be greater than 3" });
        }

        // Check if username exists
        const existingUsername = await intern.findOne({ name: name });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

  

        // Check password length
        if (DOB.length <= 2) {
            return res.status(400).json({ message: "Password length must be greater than 2" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(DOB, salt);

        // Create and save new intern
        const newIntern = new intern({
            name: name,
            DOB: hash,
            hrID: hrID,
        });

        const savedIntern = await newIntern.save();

        // Update HR document
        await hr.findByIdAndUpdate(hrID, {
            $push: { internID: savedIntern._id }
        });

        return res.status(200).json({ message: "Signup successful" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});



router.post("/login-intern",async(req,res)=>{
    try {
        const {name,DOB} = req.body;

        const existinguser = await intern.findOne({name})
        if(!existinguser){
            return res.status(400).json({message:"Invalid credential"})
        }


        bcrypt.compare(DOB, existinguser.DOB).then(function(data) {

            if(data){
                const authClaims = [{name:existinguser.name}]

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



    router.get("/getIntern-info", authenticateToken ,async (req,res)=>{
        try {
            const {id} = req.headers
            const data = await intern.findById(id).select('-password');
            return res.status(200).json(data);
            
        } catch (error) {
            res.status(500).json({message:"Internal server error"})
        }
    })




    router.get("/url-info-intern", authenticateToken, async (req, res) => {
        try {
            const { id } = req.headers;
    
            // Fetch HR data and populate internID
            const internData = await intern.findById(id).populate("links");
    
    
            if (!internData) {
                return res.status(404).json({ message: "HR not found" });
            }
    
          
            const interndata = internData.links;
            res.status(200).json({
                message: "Success to get intern data",
                data: interndata,
            });
    
        } catch (error) {
            console.error("Error fetching HR intern data:", error); // Log the error
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    });
module.exports = router;
