const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: String,
  photo: String,
  socialLinks: Object,
  contactInfo: Object,
  skills: [String],
  languages: [String],
  education: [Object],
  aboutMe: String,
  experience: [String],
  projects: [String],
  certifications: [String],
});

module.exports = mongoose.model("Resume", resumeSchema);
