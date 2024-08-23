const cron = require('node-cron');
const db = require("../connection/dbconnect")
const Intern = require('../model/intern');
const Link = require('../model/link');


db()
// Schedule a job to run daily
cron.schedule('0 0 * * *', async () => {
    try {
        const expirationPeriod = 60 * 24 * 60 * 60 * 1000; // 60 days in milliseconds
        const thresholdDate = new Date(Date.now() - expirationPeriod);

        // Find interns older than 60 days
        const expiredInterns = await Intern.find({ createdAt: { $lt: thresholdDate } });

        for (const intern of expiredInterns) {
            // Delete associated links
            await Link.deleteMany({ interns: intern._id });

            // Delete the intern
            await Intern.findByIdAndDelete(intern._id);
        }

        console.log('Expired interns and their links have been deleted');
    } catch (error) {
        console.error('Error in scheduled task:', error);
    }
});
