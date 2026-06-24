const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['open', 'booked', 'cancelled'],
      default: 'open',
      index: true,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

slotSchema.index({ tutor: 1, startTime: 1 });

slotSchema.pre('validate', function (next) {
  if (this.endTime <= this.startTime) {
    return next(new Error('endTime must be after startTime'));
  }
  next();
});

module.exports = mongoose.model('Slot', slotSchema);