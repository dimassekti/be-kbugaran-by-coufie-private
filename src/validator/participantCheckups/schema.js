const Joi = require("joi");

const CheckupPayloadSchema = Joi.object({
  userId: Joi.string().required(),
  bloodPressureSystolic: Joi.number().integer().min(50).max(300).optional(),
  bloodPressureDiastolic: Joi.number().integer().min(30).max(200).optional(),
  heartRate: Joi.number().integer().min(30).max(220).optional(),
  weight: Joi.number().precision(2).min(1).max(1000).optional(),
  height: Joi.number().precision(2).min(50).max(300).optional(),
  medicalConditions: Joi.string().optional(),
  medications: Joi.string().optional(),
  fitnessLevel: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .optional(),
  checkedBy: Joi.string().optional(),
});

const CheckupApprovalPayloadSchema = Joi.object({
  isApproved: Joi.boolean().required(),
  approvalNotes: Joi.string().optional(),
});

module.exports = {
  CheckupPayloadSchema,
  CheckupApprovalPayloadSchema,
};
