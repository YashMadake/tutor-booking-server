const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
      unique: true, // 1 booking per slot — DB-level guarantee
      index: true,
    },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);