const Joi = require('joi');

const ReviewerPayloadSchema = Joi.object({
  userId: Joi.string()
    .required(),
  name: Joi.string()
    .required(),
  degree: Joi.string()
    .optional(),
  specialization: Joi.string()
    .optional(),
  contactPhone: Joi.string()
    .pattern(/^[+]?[0-9\s\-()]+$/)
    .optional(),
  contactEmail: Joi.string()
    .email()
    .optional(),
});

const ReviewerStatusPayloadSchema = Joi.object({
  isActive: Joi.boolean()
    .required(),
});

module.exports = {
  ReviewerPayloadSchema,
  ReviewerStatusPayloadSchema,
};
