const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Student: book an open slot.
// Uses an atomic findOneAndUpdate so two concurrent requests can't both win.
exports.createBooking = asyncHandler(async (req, res) => {
  const { slotId } = req.body;

  const slot = await Slot.findOneAndUpdate(
    { _id: slotId, status: 'open', startTime: { $gte: new Date() } },
    { $set: { status: 'booked', bookedBy: req.user.id } },
    { new: true }
  );

  if (!slot) {
    throw new ApiError(409, 'Slot is not available');
  }

  try {
    const booking = await Booking.create({
      slot: slot._id,
      tutor: slot.tutor,
      student: req.user.id,
    });
    res.status(201).json({ booking, slot });
  } catch (err) {
    // Roll back slot if booking insert fails (e.g. unique index race)
    await Slot.updateOne(
      { _id: slot._id, bookedBy: req.user.id },
      { $set: { status: 'open', bookedBy: null } }
    );
    throw err;
  }
});

// Student: list own bookings
exports.listMyStudentBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ student: req.user.id })
    .populate('slot')
    .populate('tutor', 'name email')
    .sort({ createdAt: -1 });
  res.json({ bookings });
});

// Tutor: list bookings against own slots
exports.listMyTutorBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ tutor: req.user.id })
    .populate('slot')
    .populate('student', 'name email')
    .sort({ createdAt: -1 });
  res.json({ bookings });
});

// Student or tutor: cancel a booking
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  const isOwner =
    booking.student.toString() === req.user.id ||
    booking.tutor.toString() === req.user.id;
  if (!isOwner) throw new ApiError(403, 'Not allowed');

  if (booking.status !== 'confirmed')
    throw new ApiError(409, 'Booking is not active');

  booking.status = 'cancelled';
  await booking.save();

  // Free the slot back up
  await Slot.updateOne(
    { _id: booking.slot },
    { $set: { status: 'open', bookedBy: null } }
  );

  res.json({ booking });
});