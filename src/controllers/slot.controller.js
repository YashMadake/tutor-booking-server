const Slot = require('../models/Slot');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Tutor: create an availability slot
exports.createSlot = asyncHandler(async (req, res) => {
  const { startTime, endTime } = req.body;

  // Prevent overlapping slots for the same tutor
  const overlap = await Slot.findOne({
    tutor: req.user.id,
    status: { $ne: 'cancelled' },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });
  if (overlap) throw new ApiError(409, 'Slot overlaps an existing slot');

  const slot = await Slot.create({
    tutor: req.user.id,
    startTime,
    endTime,
  });
  res.status(201).json({ slot });
});

// Tutor: list own slots
exports.listMySlots = asyncHandler(async (req, res) => {
  const slots = await Slot.find({ tutor: req.user.id }).sort({ startTime: 1 });
  res.json({ slots });
});

// Public: list a tutor's open slots
exports.listTutorOpenSlots = asyncHandler(async (req, res) => {
  const slots = await Slot.find({
    tutor: req.params.userId,
    status: 'open',
    startTime: { $gte: new Date() },
  }).sort({ startTime: 1 });
  res.json({ slots });
});

// Tutor: cancel a still-open slot
exports.cancelSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.findOne({ _id: req.params.id, tutor: req.user.id });
  if (!slot) throw new ApiError(404, 'Slot not found');
  if (slot.status === 'booked')
    throw new ApiError(409, 'Cannot cancel a booked slot');
  slot.status = 'cancelled';
  await slot.save();
  res.json({ slot });
});