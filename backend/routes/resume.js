const express = require("express");
const jwt = require("jsonwebtoken");
const Resume = require("../models/Resume");
const User = require("../models/User");
const multer = require("multer");
const ejs = require('ejs');
const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const puppeteer = require('puppeteer');

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded user:", decoded); // ✅ Add this line
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token error:", error.message); // ✅ Add this too
    res.status(401).send("Invalid Token");
  }
};


router.post("/upload-photo", upload.single("photo"), (req, res) => {
  res.json({ filename: req.file.filename });
});


router.post("/save", verifyToken, async (req, res) => {
  console.log("Save endpoint hit");
  console.log("User:", req.user);
  console.log("Body:", req.body);

  try {
    const existing = await Resume.findOne({ userId: req.user.id });
    if (existing) {
      await Resume.updateOne({ userId: req.user.id }, req.body);
    } else {
      await Resume.create({ ...req.body, userId: req.user.id });
    }
    res.send("Saved");
  } catch (err) {
    console.error("Error saving resume:", err.message);
    res.status(500).send("Error saving resume");
  }
});


router.get("/get", verifyToken, async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user.id });
  res.json(resume);
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email");
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/download", verifyToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    const user = await User.findById(req.user.id).select("name email");


    if (!resume) {
      return res.status(404).send("Resume not found");
    }

    const templatePath = path.join(__dirname, '../templates/resume.ejs');

    const html = await ejs.renderFile(templatePath, {
      ...resume._doc,
      name: user.name,
      email: user.email,
      photo: !!resume.photo,
      photoUrl: resume.photo ? `http://localhost:5000/uploads/${resume.photo}` : '', // blank fallback
    });

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // required on some Linux environments
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=resume.pdf',
      'Content-Length': pdfBuffer.length,
    });

    return res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
