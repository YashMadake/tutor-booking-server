const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Public: list all tutors with their profile info
exports.listTutors = asyncHandler(async (req, res) => {
  const { subject, q } = req.query;
  const filter = {};
  if (subject) filter.subjects = subject;
  if (q) filter.$or = [
    { headline: { $regex: q, $options: 'i' } },
    { bio: { $regex: q, $options: 'i' } },
  ];

  const profiles = await TutorProfile.find(filter).populate('user', 'name email');
  res.json({ tutors: profiles });
});

// Public: single tutor by user id
exports.getTutor = asyncHandler(async (req, res) => {
  const profile = await TutorProfile.findOne({ user: req.params.userId })
    .populate('user', 'name email');
  if (!profile) throw new ApiError(404, 'Tutor not found');
  res.json({ tutor: profile });
});

// Tutor only: create/update own profile
exports.upsertMyProfile = asyncHandler(async (req, res) => {
  const profile = await TutorProfile.findOneAndUpdate(
    { user: req.user.id },
    { $set: req.body },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate('user', 'name email');
  res.json({ tutor: profile });
});

exports.getMyProfile = asyncHandler(async (req, res) => {
  const profile = await TutorProfile.findOne({ user: req.user.id })
    .populate('user', 'name email');
  if (!profile) throw new ApiError(404, 'Profile not found');
  res.json({ tutor: profile });
});