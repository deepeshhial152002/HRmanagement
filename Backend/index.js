const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const db = require("./connection/dbconnect")
const hrRouter = require("./routes/hrRouter")
const internRouter = require("./routes/internRouter")
const linkRouter = require("./routes/linkRouter")
const linkedinLinkRouter = require("./routes/linkedinLinkRouter")
const deleteLogRouter = require("./routes/deleteLogRouter")
require('./routes/scheduler');


app.use(cors({
  // origin: 'http://qodeit.store', 
  // methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
db()



app.use("/api", hrRouter );
app.use("/api", internRouter);
app.use("/api/link", linkRouter);
app.use("/api/linkedin", linkedinLinkRouter);
app.use("/api", deleteLogRouter);

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});   