const Joi = require('joi');

exports.createBooking = Joi.object({
  slotId: Joi.string().hex().length(24).required(),
});