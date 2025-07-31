const Joi = require("joi");

const HospitalPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Nama hospital wajib diisi",
    "any.required": "Nama hospital wajib diisi",
  }),
  type: Joi.string().valid("hospital", "clinic").required().messages({
    "any.only": "Tipe harus berupa hospital atau clinic",
    "any.required": "Tipe hospital wajib diisi",
  }),
  address: Joi.string().required().messages({
    "string.empty": "Alamat hospital wajib diisi",
    "any.required": "Alamat hospital wajib diisi",
  }),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9+\-\s()]+$/)
    .messages({
      "string.empty": "Nomor telepon wajib diisi",
      "any.required": "Nomor telepon wajib diisi",
      "string.pattern.base": "Format nomor telepon tidak valid",
    }),
  email: Joi.string().email({ tlds: false }).required().messages({
    "string.email": "Format email tidak valid",
    "string.empty": "Email wajib diisi",
    "any.required": "Email wajib diisi",
  }),
  description: Joi.string().allow("").messages({
    "string.base": "Deskripsi harus berupa teks",
  }),
  isActive: Joi.boolean().default(true).messages({
    "boolean.base": "Status aktif harus berupa boolean",
  }),
});

module.exports = { HospitalPayloadSchema };
