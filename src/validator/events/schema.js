const Joi = require("joi");

const EventPayloadSchema = Joi.object({
  name: Joi.string().required(),
  date: Joi.date().iso().required(),
  description: Joi.string().optional(),
});

module.exports = { EventPayloadSchema };
