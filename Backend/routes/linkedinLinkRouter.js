const express = require("express");
const router = express.Router();
// const hr = require("../model/hr");
// const intern = require("../model/intern");
const linkedinlink = require("../model/linkedinLink.js");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken")
// const {authenticateToken} = require("./auth");

router.post('/linkedinlinkcheck-add-url', async (req, res) => {
    try {
        const { url } = req.body;
        const { id } = req.headers;

        if (!url || typeof url !== 'string' || !/^https?:\/\/.+/.test(url)) {
            return res.status(400).json({ message: 'Invalid UPI/URL format' });
        }

        if (!id) {
            return res.status(400).json({ message: 'Missing intern ID' });
        }

        const linkCount = await linkedinlink.countDocuments({ interns: id });
        if (linkCount >= 60) {
            return res.status(400).json({ message: 'You can only create up to 60 links for Facebook.' });
        }

        // Check if the UPI/URL already exists in the database
        const existingLink = await linkedinlink.findOne({ url });

        if (existingLink) {
            return res.status(400).json({ message: 'This UPI/URL already exists. Please try again after 15 days.' });
        }

        // If UPI/URL is new, create a new entry with the intern ID
        const newLink = new linkedinlink({ url, interns: id });
        await newLink.save();

        return res.status(200).json({ message: 'UPI/URL successfully added', link: newLink });
    } catch (error) {
        console.error("Error in /check-and-add-url:", error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete("/linkedinlink-delete/:id",async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the link by ID and delete it
      const deletedLink = await linkedinlink.findByIdAndDelete(id);
  
      if (!deletedLink) {
        return res.status(404).json({ message: 'Link not found' });
      }
  
      return res.status(200).json({ message: 'Link deleted successfully', deletedLink });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  });



  router.get("/getlinkedinlink-inter/:id",async (req,res)=>{
    const { id } = req.params;
    try {
        // Find all links that reference the given intern's ID
        const links = await linkedinlink.find({ interns: id });

        return res.status(200).json(links); // This will return an array of all links for the specified intern
    } catch (error) {
        console.error("Error fetching links:", error);
        throw error;
    }
  })

module.exports = router;

