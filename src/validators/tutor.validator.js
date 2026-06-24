const Joi = require('joi');

exports.upsertProfile = Joi.object({
  headline: Joi.string().max(120).allow(''),
  bio: Joi.string().max(2000).allow(''),
  subjects: Joi.array().items(Joi.string().trim().min(1)).default([]),
  hourlyRate: Joi.number().min(0).default(0),
  yearsExperience: Joi.number().min(0).default(0),
});