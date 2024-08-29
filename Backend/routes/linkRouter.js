const express = require("express");
const router = express.Router();
// const hr = require("../model/hr");
// const intern = require("../model/intern");
const link = require("../model/link");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken")
// const {authenticateToken} = require("./auth");

router.post('/check-and-add-url', async (req, res) => {
    try {
        const { url } = req.body;
        const { id } = req.headers;

        if (!url || typeof url !== 'string' || !/^https?:\/\/.+/.test(url)) {
            return res.status(400).json({ message: 'Invalid UPI/URL format' });
        }

        if (!id) {
            return res.status(400).json({ message: 'Missing intern ID' });
        }

        // Check if the UPI/URL already exists in the database
        const existingLink = await link.findOne({ url });

        if (existingLink) {
            return res.status(400).json({ message: 'This UPI/URL already exists. Please try again after 15 days.' });
        }

        // If UPI/URL is new, create a new entry with the intern ID
        const newLink = new link({ url, interns: id });
        await newLink.save();

        return res.status(200).json({ message: 'UPI/URL successfully added', link: newLink });
    } catch (error) {
        console.error("Error in /check-and-add-url:", error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;

