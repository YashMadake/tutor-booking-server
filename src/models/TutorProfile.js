const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    headline: { type: String, trim: true, maxlength: 120 },
    bio: { type: String, trim: true, maxlength: 2000 },
    subjects: [{ type: String, trim: true }],
    hourlyRate: { type: Number, min: 0, default: 0 },
    yearsExperience: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TutorProfile', tutorProfileSchema);