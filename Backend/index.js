const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const db = require("./connection/dbconnect")
const hrRouter = require("./routes/hrRouter")
const internRouter = require("./routes/internRouter")
const linkRouter = require("./routes/linkRouter")
const deleteLogRouter = require("./routes/deleteLogRouter")
require('./routes/scheduler');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
db()



app.use("/api/v1", hrRouter );
app.use("/api/v1", internRouter);
app.use("/api/v1", linkRouter);
app.use("/api/v1", deleteLogRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});   