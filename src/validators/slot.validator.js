const Joi = require('joi');

exports.createSlot = Joi.object({
  startTime: Joi.date().iso().greater('now').required(),
  endTime: Joi.date().iso().greater(Joi.ref('startTime')).required(),
});