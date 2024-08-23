const express = require("express");
const router = express.Router();
const hr = require("../model/hr");
const intern = require("../model/intern");
const link = require("../model/link");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {authenticateToken} = require("./auth");


router.post('/submit-link', authenticateToken, async (req, res) => {
    try {
     
        const { id } = req.headers; // Make sure the ID is sent in the headers
        const { url } = req.body;
        

        // Find the intern by ID
        const internData = await intern.findById(id);
        if (!internData) {
            return res.status(404).json({ message: 'Intern not found' });
        }

           // Check if the URL already exists in the database
           const existingLink = await link.findOne({ url });
           if (existingLink) {
               return res.status(400).json({ 
                   message: 'This URL already exists. Try after 15 days.' 
               });
           }
        // Create a new link
        const newLink = new link({
            url: url,  // URL should be a single string
            interns: id
        });

        // Save the link
        const savedLink = await newLink.save();

        // Add the link ID to the intern's links array
        internData.links.push(savedLink._id);
        await internData.save();

        return res.status(200).json({ message: 'Link submitted successfully', link: savedLink });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;

