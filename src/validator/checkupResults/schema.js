const Joi = require("joi");

const CheckupResultPayloadSchema = Joi.object({
  resultStatus: Joi.string()
    .valid("allowed", "allowed_with_note", "declined")
    .required(),
  organizerNotes: Joi.string().optional(),
  healthConcerns: Joi.string().optional(),
  restrictions: Joi.string().optional(),
  recommendations: Joi.string().optional(),
  reviewedBy: Joi.string().required(),
});

module.exports = {
  CheckupResultPayloadSchema,
};
