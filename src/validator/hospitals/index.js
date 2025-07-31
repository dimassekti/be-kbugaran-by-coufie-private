const InvariantError = require("../../exceptions/InvariantError");
const { HospitalPayloadSchema } = require("./schema");

const HospitalsValidator = {
  validateHospitalPayload: (payload) => {
    const validationResult = HospitalPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = HospitalsValidator;
