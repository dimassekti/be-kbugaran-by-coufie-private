const Joi = require("joi");

const EventMedicalStaffPayloadSchema = Joi.object({
  hospitalStaffId: Joi.string().required(),
  assignmentRole: Joi.string().default("medical_support"),
  notes: Joi.string().allow(""),
});

module.exports = { EventMedicalStaffPayloadSchema };
