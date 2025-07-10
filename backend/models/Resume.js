const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: String,
  photo: String,
  socialLinks: [Object],
  contactInfo: Object,
  skills: [String],
  languages: [String],
  education: [Object],
  aboutMe: String,
  experience: [Object],
  projects: [Object],
  certifications: [Object],
});

module.exports = mongoose.model("Resume", resumeSchema);
