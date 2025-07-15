const Joi = require("joi");

const ParticipantPayloadSchema = Joi.object({
  userId: Joi.string().required(),
  role: Joi.string()
    .valid(
      "participant",
      "organizer",
      "instructor",
      "medical_staff",
      "volunteer"
    )
    .default("participant"),
});

const ParticipantStatusPayloadSchema = Joi.object({
  status: Joi.string()
    .valid(
      "registered",
      "confirmed",
      "checked_in",
      "completed",
      "cancelled",
      "no_show"
    )
    .required(),
  notes: Joi.string().optional(),
});

module.exports = {
  ParticipantPayloadSchema,
  ParticipantStatusPayloadSchema,
};
