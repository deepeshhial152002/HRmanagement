const express = require("express");
const router = express.Router();
const hr = require("../model/hr");
const intern = require("../model/intern");
const link = require("../model/link");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {authenticateToken} = require("./auth");


// Revised /submit-link endpoint
router.post('/submit-link', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { url } = req.body;

        if (!id || !url || typeof url !== 'string' || !/^https?:\/\/.+/.test(url)) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const internData = await intern.findById(id);
        if (!internData) {
            return res.status(404).json({ message: 'Intern not found' });
        }

        const existingLink = await link.findOne({ url });
        if (existingLink) {
            return res.status(400).json({ message: 'This URL already exists. Try after 15 days.' });
        }

        const newLink = new link({ url, interns: id });
        const savedLink = await newLink.save();
        internData.links.push(savedLink._id);
        await internData.save();

        res.status(200).json({ message: 'Link submitted successfully', link: savedLink });

    } catch (error) {
        console.error("Error in /submit-link:", error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;

