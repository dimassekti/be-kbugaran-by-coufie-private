const Joi = require("joi");

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  role: Joi.string().valid("admin", "staff", "member").optional(),
});

const UserRoleUpdateSchema = Joi.object({
  role: Joi.string().valid("admin", "staff", "member").required(),
});

module.exports = { UserPayloadSchema, UserRoleUpdateSchema };
