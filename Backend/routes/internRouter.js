const express = require("express");
const router = express.Router();
const hr = require("../model/hr");
const intern = require("../model/intern");
const link = require("../model/link");
const linkedinlink = require("../model/linkedinLink");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {authenticateToken} = require("../routes/auth");

router.post("/sign-up-intern", async (req, res) => {
    try {
        const { name, DOB, hrID } = req.body;

        // Check name length
        if (name.length < 4) {
            return res.status(400).json({ message: "Name length must be greater than 3" });
        }

        // Check DOB length
        if (DOB.length <= 2) {
            return res.status(400).json({ message: "DOB length must be greater than 2" });
        }

        // Hash DOB
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
        console.error("Error during sign-up:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});




router.post("/login-intern", async (req, res) => {
    try {
        const { name, DOB } = req.body;

        const existingUser = await intern.findOne({ name });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(DOB, existingUser.DOB);
        if (isMatch) {
            const authClaims = { name: existingUser.name };
            const token = jwt.sign(authClaims, process.env.jwtkey);
            return res.status(200).json({ id: existingUser._id, token });
        } else {
            return res.status(400).json({ message: "Invalid credentials" });
        }

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



    

    router.get('/user-links', authenticateToken, async (req, res) => {
        try {
            const { id } = req.headers;
    
            if (!id) {
                return res.status(400).json({ message: 'User ID is required in the headers.' });
            }
    
            // Fetch the intern profile
            const internData = await intern.findById(id).select('name');
            if (!internData) {
                return res.status(404).json({ message: 'Intern not found.' });
            }
    
            // Fetch all links associated with the intern
            const linksData = await link.find({ interns: id }).select('url createdAt');
    
            res.status(200).json({
                profile: {
                    name: internData.name,
                },
                links: linksData.length ? linksData : [],
            });
        } catch (error) {
            console.error("Error in /user-links:", error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    });
    
    router.get('/user-linkedinlink', authenticateToken, async (req, res) => {
        try {
            const { id } = req.headers;
    
            if (!id) {
                return res.status(400).json({ message: 'User ID is required in the headers.' });
            }
    
            // Fetch the intern profile
            const internData = await intern.findById(id).select('name');
            if (!internData) {
                return res.status(404).json({ message: 'Intern not found.' });
            }
    
            // Fetch all links associated with the intern
            const linksData = await linkedinlink.find({ interns: id }).select('url createdAt');
    
            res.status(200).json({
                profile: {
                    name: internData.name,
                },
                links: linksData.length ? linksData : [],
            });
        } catch (error) {
            console.error("Error in /user-linkedinlink:", error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    });
    
    
    
module.exports = router;
