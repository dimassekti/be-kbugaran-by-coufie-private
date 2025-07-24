const Joi = require("joi");

const EventPayloadSchema = Joi.object({
  name: Joi.string().required(),
  date: Joi.date().iso().required(),
  description: Joi.string().optional(),
  location: Joi.string().optional(),
  organizer: Joi.string().optional(),
  capacity: Joi.number().integer().positive().optional(),
  category: Joi.string()
    .valid(
      "Seminar",
      "Workshop",
      "Kompetisi",
      "Konferensi",
      "Pelatihan",
      "Webinar",
      "Lainnya"
    )
    .optional(),
});

module.exports = { EventPayloadSchema };
