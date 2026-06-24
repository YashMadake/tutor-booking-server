const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash, role });

  // Auto-create an empty tutor profile so the tutor can fill it in later
  if (role === 'tutor') {
    await TutorProfile.create({ user: user._id });
  }

  res.status(201).json({ user, token: signToken(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');

  res.json({ user, token: signToken(user) });
});

exports.me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user });
});