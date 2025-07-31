const InvariantError = require("../../exceptions/InvariantError");
const { HospitalStaffPayloadSchema } = require("./schema");

const HospitalMedicalStaffValidator = {
  validateHospitalStaffPayload: (payload) => {
    const validationResult = HospitalStaffPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = HospitalMedicalStaffValidator;
