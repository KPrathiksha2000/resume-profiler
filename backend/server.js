const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded photos

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    tlsAllowInvalidCertificates:true
}).then(() => console.log("MongoDB connected")).catch(err=>console.error(err));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/resume", require(path.join(__dirname, "routes", "resume")));

app.listen(5000, () => console.log("Server running on port 5000"));
