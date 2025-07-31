const Joi = require("joi");

const HospitalStaffPayloadSchema = Joi.object({
  userId: Joi.string().required(),
  staffRole: Joi.string().valid("doctor", "nurse").required(),
  specialization: Joi.string().allow(""),
  licenseNumber: Joi.string().allow(""),
  yearsOfExperience: Joi.number().integer().positive().allow(null),
});

module.exports = { HospitalStaffPayloadSchema };
